const Promise = require('bluebird')
const cmd = require('node-cmd')
const cmdGetAsync = Promise.promisify(cmd.get, {
  multiArgs: true,
  context: cmd,
})

const compress = async (src, dst, crf = 20) => {
  const ffmpegCommand = `ffmpeg -i "${src}" "${dst}" -crf ${crf} -y -loglevel error`
  console.log(ffmpegCommand)
  const [success, error] = await cmdGetAsync(ffmpegCommand)
  if (error) throw new Error(error)
  return success
}

module.exports = {
  compress,
}
