const fs = require('fs')

function getSpecDirectories({ dir, filelist, basePath }) {
  const files = fs.readdirSync(dir)
  filelist = filelist || []
  files.forEach(file => {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      filelist = getSpecDirectories({
        dir: `${dir}/${file}`,
        filelist,
        basePath,
      })
    } else {
      const path = basePath ? dir.replace(basePath, '') : dir
      filelist.push(`${path}/${file}`)
    }
  })
  return filelist
}

module.exports = getSpecDirectories
