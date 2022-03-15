export default function getDocument() {
  // Generates a random array of 9 digits such that digits are not all equal
  let cpf

  do {
    cpf = [...new Array(9)].map(() => Math.floor(10 * Math.random()))
  } while (cpf.every((digit, _, arr) => digit === arr[0]))

  // Adds the 10-th digit
  cpf.push(
    ((cpf.reduce((sum, value, idx) => sum + (10 - idx) * value, 0) * 10) % 11) %
      10
  )
  // Adds the 11-th digit
  cpf.push(
    ((cpf.reduce((sum, value, idx) => sum + (11 - idx) * value, 0) * 10) % 11) %
      10
  )

  // Transforms array into string
  return cpf.join('')
}
