require('dotenv').config()

const fs = require('fs').promises
const path = require('path')

const cypress = require('cypress')
const Promise = require('bluebird')
const uuidv4 = require('uuid/v4')
const commander = require('commander')
const chalk = require('chalk')

const { getTestFiles } = require('../../utils/specs')
const monitoring = require('./monitoring')
const s3 = require('./s3')
const { customProcessing } = require('./cli-utils')
const pkg = require('../../package.json')

const program = commander
  .version(pkg.version)
  .name('checkout-ui-monitoring')
  .description('Checkout UI Monitoring tool')
  .option('-e, --env <env>', 'Name of the environment to use', 'stable')
  .option(
    '-w, --workspace <workspace>',
    'Name of the workspace to use',
    'master'
  )
  .option(
    '-a, --accounts <accounts>',
    '[OPTIONAL] Name of the accounts to filter the tests, e.g. vtexgame1,vtexgame1clean\nNot providing this value will run the tests on all accounts available',
    customProcessing.commaSeparatedList,
    []
  )
  .option(
    '-p, --pattern <pattern>',
    "[OPTIONAL] Filter tests to run by pattern, e.g. 'shipping\\/Delivery - Boleto'"
  )
  .option(
    '--headless',
    'Run cypress in headless mode, in constrast with headed',
    true
  )
  .option(
    '--no-headless',
    'Run cypress in headed mode, in contrast with headless'
  )
  .option(
    '--skip-upload',
    'Skip sending failed spec runs to monitoring API',
    false
  )
  .parse(process.argv)

if (process.env.VTEX_ENV != null) {
  console.warn(
    chalk`{yellow The environment variable VTEX_ENV is deprecated, use the --env flag instead.}`
  )
  program.env = process.env.VTEX_ENV
}

if (process.env.VTEX_WORKSPACE != null) {
  console.warn(
    chalk`{yellow The environment variable VTEX_WORKSPACE is deprecated, use the --workspace flag instead.}`
  )
  program.workspace = process.env.VTEX_WORKSPACE
}

const isIOEnv = program.env === 'beta-io'

const BASE_PATH = path.resolve(__dirname, '..', '..', 'tests')
const CONCURRENCY = 1
const CYPRESS_CONFIG = {
  headed: !program.headless,
  headless: program.headless,
  config: {
    chromeWebSecurity: false,
    blacklistHosts: ['www.googletagmanager.com'],
    pageLoadTimeout: 180000,
    viewportHeight: 660,
    viewportWidth: 1024,
    trashAssetsBeforeRuns: false,
    videoUploadOnPasses: false,
    env: {
      VTEX_ENV: isIOEnv ? 'stable' : program.env,
      VTEX_WORKSPACE: program.workspace,
    },
    video: !program.skipUpload,
  },
  projectId: 'kobqo4',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true,
  },
}

async function sendResults(result, spec) {
  if (!result || result.message === 'Could not find Cypress test run results') {
    console.error('Could not find Cypress test run results')
    return
  }

  const runId = uuidv4()

  result.runs = await Promise.all(
    result.runs.map(async run => {
      try {
        if (run.stats.failures === 0 || program.skipUpload) {
          await fs.unlink(`cypress/videos/${run.spec.name}.mp4`)
          return run
        }

        console.log(`Uploading video for ${run.spec.name}`)

        const { url: videoUrl } = await s3.uploadFile(
          run.video,
          `${runId}/${run.spec.name}.mp4`,
          'video/mp4'
        )

        return { ...run, video: videoUrl }
      } catch (err) {
        console.error(err)
        return run
      }
    })
  )

  if (program.skipUpload) {
    return
  }

  console.log(`Sending result to monitoring for "${spec}"`)
  await monitoring({
    config: {
      evidence: {
        expirationInSeconds: 7 * 24 * 60 * 60, // 7 days
      },
      env: isIOEnv ? 'beta' : program.env,
      applicationName: `checkout-ui${isIOEnv ? '-io' : ''}`,
      healthcheck: {
        moduleName: `Checkout UI ${isIOEnv ? '(IO Beta)' : ''}`,
        status: result.totalFailed > 0 ? 0 : 1,
        title: spec,
      },
    },
    tests: result,
  })
}

function runCypress(spec) {
  return cypress
    .run({
      spec: `./tests/${spec}`,
      ...CYPRESS_CONFIG,
    })
    .then(result => {
      sendResults(result, spec)
    })
    .catch(err => {
      console.log(err)
      return Promise.resolve()
    })
}

const run = async () => {
  const specs = await getTestFiles({
    dir: BASE_PATH,
    accounts: program.accounts,
    pattern: program.pattern,
  })

  if (!specs.length) {
    console.log('No spec files were found...')
    return
  }

  console.log(`Found ${specs.length} test(s)`)

  try {
    console.log('Downloading fixtures...')
    await s3.downloadFixture()
    console.log('Fixtures downloaded.')

    console.log('Starting Tests...')
    Promise.map(specs, runCypress, { concurrency: CONCURRENCY })
    return
  } catch (err) {
    console.log(err.message)
  }
}

run()
