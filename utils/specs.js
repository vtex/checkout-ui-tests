const globby = require('globby')

function getTestFiles({ dir, accounts, pattern }) {
  const globPattern = pattern ? `${pattern}*.test.{js,ts}` : `**/*.test.{js,ts}`

  return globby(globPattern, { onlyFiles: true, cwd: dir }).then(specs => {
    if (accounts && accounts.length > 0) {
      return specs.filter(spec =>
        accounts.some(account => spec.includes(`${account}.`))
      )
    }

    return specs
  })
}

module.exports = { getTestFiles }
