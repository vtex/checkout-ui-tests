const fs = require('fs')

const { ACCOUNT_NAMES } = require('../utils/constants')

function start() {
  const currentPath = process.cwd()
  const testsPath = currentPath.replace('src', 'tests')

  const files = getSpecDirectories({ dir: testsPath, basePath: testsPath })

  const modelFiles = files.filter(file => file.includes('models'))
  modelFiles.forEach(fileUrl => {
    Object.values(ACCOUNT_NAMES).forEach(account => {
      const splittedFilePath = fileUrl.split('models/')
      const [filepath, fileTitle] = splittedFilePath
      writeResultsToJs({
        account,
        dir: testsPath + filepath,
        fileTitle,
      })
    })
  })
}

function getSpecDirectories({ dir, filelist, basePath }) {
  const files = fs.readdirSync(dir)
  filelist = filelist || []
  files
    .filter(item => !/(^|\/)\.[^/.]/g.test(item))
    .forEach(file => {
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

function writeResultsToJs({ account, dir, fileTitle }) {
  if (!fileTitle) return

  const content = `
  import test from "./models/${fileTitle}"

  test("${account}")
  `
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    const updatedFileTitle = fileTitle.replace(
      '.model.js',
      ` - ${account}.test.js`
    )

    fs.writeFileSync(`${dir}/${updatedFileTitle}`, content, 'utf8')
  } catch (err) {
    console.error(err)
  }
}

start()
