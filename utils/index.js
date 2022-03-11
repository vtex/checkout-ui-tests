import {
  ADD_SKUS_ENDPOINT,
  getBaseURL,
  CHECKOUT_ENDPOINT,
  DEFAULT_ACCOUNT_NAME,
  ACCOUNT_NAMES,
} from './constants'

const BASE_CONFIG = {
  accountName: DEFAULT_ACCOUNT_NAME,
  environment: Cypress.env('VTEX_ENV') || process.env.VTEX_ENV || 'stable',
  workspace: Cypress.env('VTEX_WORKSPACE'),
  appKey: Cypress.env('APP_KEY'),
  appToken: Cypress.env('APP_TOKEN'),
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

  cy.intercept({
    method: 'POST',
    path: '/api/checkout/**',
  }).as('checkoutRequest')

  cy.intercept({
    method: 'GET',
    path: '/api/checkout/**',
  }).as('checkoutRequest')

  cy.intercept({
    method: 'POST',
    path: '/api/checkout/pub/orderForm/*/items/update',
  }).as('itemsUpdateRequest')

  cy.intercept({
    method: 'GET',
    path: '/legacy-extensions/checkout?*',
  }).as('getRuntimeContext')

  if (Cypress.env('isLogged')) {
    cy.intercept({
      method: 'GET',
      path: '/api/vtexid/**',
    }).as('vtexId')
  }

  if (mobile) {
    cy.viewport(414, 736)
  } else {
    cy.viewport(1280, 800)
  }

  cy.visit(url)

  let orderFormId

  cy.getCookie('checkout.vtex.com').then(
    (cookie) => (orderFormId = cookie.value.split('=')[1])
  )

  cy.on('fail', (error) => {
    error.stack = `orderFormId: ${orderFormId}\n${error.stack}`
    throw error
  })

  cy.wait('@getRuntimeContext', { timeout: 60000 })
    .its('response.statusCode')
    .should('eq', 200)

  return cy
}

export function visitAndClearCookies(account = ACCOUNT_NAMES.DEFAULT) {
  cy.visit(
    getBaseURL({
      ...BASE_CONFIG,
      accountName: account,
    }) + CHECKOUT_ENDPOINT
  )
  cy.wait(3000)
  cy.clearCookies()
  cy.clearLocalStorage()

  if (BASE_CONFIG.environment === 'beta') {
    cy.setCookie('vtex-commerce-env', 'beta')
  }

  if (BASE_CONFIG.environment === 'io') {
    cy.request(
      'POST',
      `http://api.vtexcommercestable.com.br/api/vtexid/apptoken/login?an=${account}`,
      {
        appkey: BASE_CONFIG.appKey,
        apptoken: BASE_CONFIG.appToken,
      }
    ).then((response) => {
      cy.setCookie('VtexIdclientAutCookie', response.body.token)
    })
  }
}

export function getAddSkusEndpoint({ skus, account, salesChannel }) {
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

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
