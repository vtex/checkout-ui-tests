import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import AWS from 'aws-sdk'

const ACL = 'public-read'
const BUCKET = 'vtex-id-hc'
const KEY_PREFIX = 'healthcheck/tests/'
const REGION = 'us-east-1'

AWS.config.update({
  region: REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.HORUS_COGNITO_CREDENTIALS,
  }),
})

const s3 = new AWS.S3()

export const uploadFile = async (src, dst, contentType = null) => {
  const key = KEY_PREFIX + dst

  try {
    await s3
      .putObject({
        ACL,
        Bucket: BUCKET,
        Body: fs.readFileSync(src),
        Key: key,
        ContentType: contentType,
      })
      .promise()

    return {
      url: `https://${BUCKET}.s3.amazonaws.com/${key}`,
      signed: s3.getSignedUrl('getObject', { Bucket: BUCKET, Key: key }),
    }
  } catch (err) {
    console.log(err)
  }
}

export const downloadFixture = async () => {
  const fixturesDir = fileURLToPath(
    new URL('../../cypress/fixtures', import.meta.url)
  )

  const fixturesFile = path.join(fixturesDir, 'users.json')

  if (fs.existsSync(fixturesFile)) return

  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir)
  }

  try {
    const response = await s3
      .getObject({ Bucket: BUCKET, Key: 'healthcheck/users.json' })
      .promise()

    fs.writeFileSync(fixturesFile, response.Body)
  } catch (err) {
    console.log(err)
  }
}
