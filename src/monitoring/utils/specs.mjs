import globby from 'globby'

// Paths excluded from the cron-driven synthetic monitoring sweep. Regression
// specs (tests/regression/*.test.ts) are shopper-independent guards exercised by
// the GitHub E2E workflow (Cypress `specPattern`), so they don't belong in the
// "Checkout UI" monitoring run.
const MONITORING_IGNORE = ['regression/**']

export function getTestFiles({ dir, accounts, pattern = '?' }) {
  let globPattern = `**/*${pattern}*.test.{js,ts}`

  if (accounts.length > 0) {
    globPattern = `**/*${pattern}*+(${accounts.join('|')}).test.{js,ts}`
  }

  return globby(globPattern, {
    onlyFiles: true,
    cwd: dir,
    ignore: MONITORING_IGNORE,
  })
}
