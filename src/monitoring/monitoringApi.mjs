import fs from 'fs'
import { fileURLToPath } from 'url'

import pug from 'pug'
import http from 'axios'

const templateUrl = fileURLToPath(
  new URL('./templates/evidence.pug', import.meta.url)
)

const compile = pug.compileFile(templateUrl)

const pad = (v, len = 2) => v.toString().padStart(len, 0)

function msToTime(s) {
  s = parseInt(s, 10)
  const ms = s % 1000

  s = (s - ms) / 1000
  const secs = s % 60

  s = (s - secs) / 60
  const mins = s % 60
  const hrs = (s - mins) / 60

  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}.${pad(ms, 3)}`
}

function format(date) {
  const d = new Date(date)
  const hour = pad(d.getHours(), 2)
  const minute = pad(d.getMinutes(), 2)
  const second = pad(d.getSeconds(), 2)
  const day = pad(d.getDate(), 2)
  const month = pad(d.getMonth() + 1, 2)
  const year = pad(d.getFullYear(), 4)

  return `${hour}:${minute}:${second} ${day}/${month}/${year}`
}

export default async function sendToMonitoring(data) {
  if (!data || !data.tests || !data.config) {
    return false
  }

  const testsData = data.tests
  const { config } = data

  const { applicationName } = config
  const healthcheckConfig = config.healthcheck
  const evidenceConfig = config.evidence

  const healthcheckUrl =
    'https://5gkb7l6p2k.execute-api.us-east-1.amazonaws.com/default/HorusProxy'

  // Build message
  const message = compile({
    startedTestsAt: format(testsData.startedTestsAt),
    endedTestsAt: format(testsData.endedTestsAt),
    totalDuration: testsData.totalDuration,
    totalTests: testsData.totalTests,
    totalFailed: testsData.totalFailed,
    totalPassed: testsData.totalPassed,
    totalPending: testsData.totalPending,
    totalSkipped: testsData.totalSkipped,
    runs: testsData.runs,
  })

  // Dev
  if (process.env.DEV || !process.env.HORUS_PROXY_KEY) {
    fs.writeFileSync('./output.html', message)
  }

  // Send to Healthcheck
  const healthcheckData = {
    env: config.env,
    evidence: {
      applicationName,
      expirationInSeconds: evidenceConfig.expirationInSeconds,
      message,
    },
    healthcheck: {
      Status: healthcheckConfig.status,
      Title: healthcheckConfig.title,
      Etime: msToTime(testsData.totalDuration),
      Module: healthcheckConfig.moduleName,
    },
  }

  if (!process.env.HORUS_PROXY_KEY) return

  try {
    const { data: hcResponseData, status } = await http.post(
      healthcheckUrl,
      healthcheckData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.HORUS_PROXY_KEY,
        },
      }
    )

    console.log({ hcResponseData, status })
  } catch (error) {
    console.log({ error })
    console.log(error.response)
  }
}
