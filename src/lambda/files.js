console.log('Loading function')
const AWS = require('aws-sdk')

const s3 = new AWS.S3()
const ACL = 'public-read'
const BUCKET = 'vtex-id-hc'
const KEY_PREFIX = 'healthcheck/tests/'

exports.handler = async (event, context, callback) => {
  const done = (err, res) =>
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
      },
    })

  const data = event.queryStringParameters
  const destPath = data.dst
  const { contentType } = data

  const uploadFile = async () => {
    const key = KEY_PREFIX + destPath

    console.log('key', key)
    await s3
      .putObject({
        ACL,
        Bucket: BUCKET,
        Body: event.body,
        Key: key,
        ContentType: contentType,
      })
      .promise()

    done(null, {
      url: `https://${BUCKET}.s3.amazonaws.com/${key}`,
      signed: s3.getSignedUrl('getObject', { Bucket: BUCKET, Key: key }),
    })
  }

  switch (event.httpMethod) {
    case 'POST':
      console.log('Uploading file')
      await uploadFile()
      break

    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`))
  }
}
