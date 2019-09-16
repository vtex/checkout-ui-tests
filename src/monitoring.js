require("node-window-polyfill").register()

const pug = require("pug")
const axios = require("axios")
const http = require("axios")
const fs = require("fs")

const templateUrl = `${__dirname}/templates/evidence.pug`
const compile = pug.compileFile(templateUrl)

const evidenceExpirationDefault = 86400 // 24h in seconds

const isDev = process.env.MODE === "dev"

const pad = (v, len = 2) => v.toString().padStart(len, 0)

function msToTime(s) {
  s = parseInt(s, 10)
  var ms = s % 1000
  s = (s - ms) / 1000
  var secs = s % 60
  s = (s - secs) / 60
  var mins = s % 60
  var hrs = (s - mins) / 60

  return pad(hrs) + ":" + pad(mins) + ":" + pad(secs) + "." + pad(ms, 3)
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

const main = async data => {
  if (!data || !data.tests || !data.config) {
    return false
  }

  const testsData = data.tests
  const config = data.config

  const applicationName = config.applicationName
  const healthcheckConfig = config.healthcheck
  const evidenceConfig = config.evidence

  const healthcheckUrl = `https://xzvyac22zi.execute-api.us-east-1.amazonaws.com/default/HorusProxy`
  const evidenceApiBaseUrl = "http://vtexgame1.myvtex.com/api"

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
  if (isDev) {
    fs.writeFileSync("./output.html", message)
  }

  // Create evidence
  const { data: evidenceHash } = await http.put(
    `${evidenceApiBaseUrl}/Evidence?application=${applicationName}&expirationInSeconds=${evidenceConfig.expirationInSeconds ||
      evidenceExpirationDefault}`,
    message,
    {
      headers: { "content-type": "text/plain; charset=utf-8" },
    }
  )

  // Send to Healthcheck
  const healthcheckData = {
    env: config.env,
    healthcheck: {
      Status: healthcheckConfig.status,
      Title: healthcheckConfig.title,
      Etime: msToTime(testsData.totalDuration),
      EvidencePath: `${evidenceApiBaseUrl}/evidence?application=${applicationName}&hash=${evidenceHash}`,
      Module: healthcheckConfig.moduleName,
    },
  }
  try {
    const { data: hcResponseData, status } = await http.post(
      healthcheckUrl,
      healthcheckData,
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    console.log({ hcResponseData, status })
  } catch (error) {
    console.log({ error })
    console.log(error.response)
  }
}
module.exports = main
