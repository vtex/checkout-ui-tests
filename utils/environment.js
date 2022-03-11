export const vtexEnv =
  Cypress.env('VTEX_ENV') || process.env.VTEX_ENV || 'stable'

export const workspace = Cypress.env('VTEX_WORKSPACE') || 'master'

export const appKey = Cypress.env('APP_KEY')
export const appToken = Cypress.env('APP_TOKEN')
