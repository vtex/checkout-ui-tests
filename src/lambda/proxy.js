console.log('Loading function')
const axios = require('axios')

const evidenceExpirationDefault = 86400 // 24h in seconds

const EVIDENCE_HOST = `http://evidence.vtex.com`
const EVIDENCE_PATH = (config) =>
  `/api/evidence?application=${config.applicationName}&expirationInSeconds=${
    config.expirationInSeconds || evidenceExpirationDefault
  }`

const HEALTHCHECK_HOST = `http://monitoring.vtex.com`
const HEALTHCHECK_PATH = (env) =>
  `/api/healthcheck/results?repository=${env || 'beta'}`

exports.handler = (event, context, callback) => {
  const done = (err, res) =>
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
      },
    })

  const data = JSON.parse(event.body)

  console.log('data', data)

  const { env } = data
  const healthcheckData = data.healthcheck
  const evidenceData = data.evidence

  const sendToMonitoring = (evidenceHash) => {
    console.log('Entered sendToMonitoring')

    const localHealthcheckData = {
      ...healthcheckData,
      EvidencePath: `${EVIDENCE_HOST}/api/evidence?application=${evidenceData.applicationName}&hash=${evidenceHash}`,
    }

    const monitoringURL = HEALTHCHECK_HOST + HEALTHCHECK_PATH(env)
    const requestData = JSON.stringify(localHealthcheckData)
    const monitoringRequestConfig = {
      url: monitoringURL,
      method: 'post',
      data: requestData,
      headers: {
        'content-type': 'application/json',
      },
    }

    axios(monitoringRequestConfig)
      .then(() => {
        console.log('Sent to monitoring successfully')
        done(null)
      })
      .catch((err) => done(new Error(`ERROR ${err}`)))
  }

  const sendHealthcheckData = () => {
    console.log('Entered sendHealthcheckData')
    const evidenceURL = EVIDENCE_HOST + EVIDENCE_PATH(evidenceData)
    const evidenceRequestConfig = {
      url: evidenceURL,
      data: evidenceData.message,
      method: 'put',
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    }

    axios(evidenceRequestConfig)
      .then((response) => {
        console.log('Got evidence hash successfully')
        const evidenceHash = response.data

        sendToMonitoring(evidenceHash)
      })
      .catch((err) => done(new Error(`ERROR ${err}`)))
  }

  switch (event.httpMethod) {
    case 'POST':
      console.log('Sending healthcheck data')
      sendHealthcheckData()

      break

    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`))
  }
}
