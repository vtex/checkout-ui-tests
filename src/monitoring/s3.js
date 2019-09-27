const fs = require("fs")
const AWS = require("aws-sdk")
const ACL = "public-read"
const BUCKET = "vtex-id-hc"
const KEY_PREFIX = "healthcheck/tests/"
const REGION = "us-east-1"
const cwd = process.cwd()

AWS.config.update({
  region: REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.HORUS_COGNITO_CREDENTIALS,
  }),
})
const s3 = new AWS.S3()

const uploadFile = async (src, dst, contentType = null) => {
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
      signed: s3.getSignedUrl("getObject", { Bucket: BUCKET, Key: key }),
    }
  } catch (err) {
    console.log(err)
  }
}

const downloadFixture = async () => {
  const fixturesDir = `${__dirname}/../../cypress/fixtures`
  const fixturesFile = `${fixturesDir}/users.json`
  if (fs.existsSync(fixturesFile)) return

  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir)
  }

  try {
    const response = await s3
      .getObject({ Bucket: BUCKET, Key: "healthcheck/users.json" })
      .promise()
    fs.writeFileSync(fixturesFile, response.Body)
  } catch (err) {
    console.log(err)
  }
}

module.exports = { uploadFile, downloadFixture }
