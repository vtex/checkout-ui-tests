import globby from 'globby'

export function getTestFiles({ dir, accounts, pattern = '?' }) {
  let globPattern = `**/*${pattern}*.test.{js,ts}`

  if (accounts.length > 0) {
    globPattern = `**/*${pattern}*+(${accounts.join('|')}).test.{js,ts}`
  }

  return globby(globPattern, { onlyFiles: true, cwd: dir })
}
