import {
  ADD_SKUS_ENDPOINT,
  BASE_URL,
  PROFILE_ENDPOINT,
  getBaseURL,
  CHECKOUT_ENDPOINT,
  DEFAULT_ACCOUNT_NAME,
  ACCOUNT_NAMES,
} from './constants'

const BASE_CONFIG = {
  accountName: DEFAULT_ACCOUNT_NAME,
  environment: Cypress.env('VTEX_ENV') || process.env.VTEX_ENV || 'stable',
  workspace: Cypress.env('VTEX_WORKSPACE'),
}

export function setup({
  mobile = false,
  isGiftList = false,
  skus,
  account = ACCOUNT_NAMES.DEFAULT,
  salesChannel = 1,
}) {
  let url = ''

  if (isGiftList) {
    url = getAddGiftListEndpoint(
      getAddSkusEndpoint({ account, skus, salesChannel }),
      '21'
    )
  } else {
    url = getAddSkusEndpoint({ account, skus, salesChannel })
  }

  cy.server()

  cy.route({ method: 'POST', url: '/api/checkout/**' }).as('checkoutRequest')
  cy.route({ method: 'GET', url: '/api/checkout/**' }).as('checkoutRequest')

  if (Cypress.env('isLogged')) {
    cy.route({ method: 'GET', url: '/api/vtexid/**' }).as('vtexId')
  }

  if (mobile) {
    cy.viewport(414, 736)
  } else {
    cy.viewport(1280, 800)
  }

  cy.visit(url)

  let orderFormId

  cy.getCookie('checkout.vtex.com').then(
    cookie => (orderFormId = cookie.value.split('=')[1])
  )

  cy.on('fail', error => {
    error.message = orderFormId
    throw error
  })

  return cy
}

export function visitAndClearCookies(account = ACCOUNT_NAMES.DEFAULT) {
  cy.visit(
    getBaseURL({
      ...BASE_CONFIG,
      accountName: account,
    }) + CHECKOUT_ENDPOINT
  )
  cy.clearCookies()
  cy.clearLocalStorage()

  if (BASE_CONFIG.environment === 'beta') {
    cy.setCookie('vtex-commerce-env', 'beta')
  }
}

export function getAddSkusEndpoint({ skus, account, salesChannel }) {
  deleteAllCookies()

  const baseURL =
    getBaseURL({
      ...BASE_CONFIG,
      accountName: account,
    }) + ADD_SKUS_ENDPOINT

  const skuEndpoint = (acumulatedSkus, sku, index) =>
    `${acumulatedSkus}${
      index > 0 ? '&' : ''
    }sku=${sku}&qty=1&seller=1&sc=${salesChannel}`

  return Array.from(skus).reduce(skuEndpoint, baseURL)
}

export function getAddGiftListEndpoint(url, giftRegistry) {
  deleteAllCookies()
  return `${url}&gr=${giftRegistry}`
}

export function identityPurchase(email) {
  deleteAllCookies()

  cy.request(`${BASE_URL}${PROFILE_ENDPOINT}?email=${email}&sc=1`).as(
    '@checkoutRequest'
  )
}

export function deleteAllCookies() {
  cy.clearCookies('https://vtexgame1.myvtex.com')
  cy.clearCookies('https://io.vtexpayments.com.br')

  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

export function waitLoad() {
  cy.get('#vtexIdUI-global-loader').should('not.exist')
  cy.get('.icon-spinner').should('not.be.visible')
}
