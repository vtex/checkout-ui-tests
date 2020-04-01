export default function getDocument() {
  // Generates a random array of 9 digits
  const cpf = [...new Array(9)].map(() => Math.floor(10 * Math.random()))
  // Adds the 10-th digit
  cpf.push(
    (cpf.reduce((sum, value, idx) => sum + (10 - idx) * value, 0) * 10) % 11
  )
  // Adds the 11-th digit
  cpf.push(
    (cpf.reduce((sum, value, idx) => sum + (11 - idx) * value, 0) * 10) % 11
  )
  // Transforms array into string
  return cpf.join('')
}
