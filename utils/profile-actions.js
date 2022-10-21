import { baseConfig, getRandomInt } from '.'
import { ACCOUNT_NAMES, getBaseURL } from './constants'
import getDocument from './document-generator'

const PROFILE_DATA = {
  BRA: {
    document: getDocument(),
    phone: '21999999999',
  },
  PER: {
    document: '12345678',
    phone: '12345678',
  },
}

export function fillEmail(email) {
  cy.get('#cart-to-orderform').click()
  cy.get('#client-pre-email').type(email)
  cy.get('#btn-client-pre-email').click()
}

export function fillProfile(
  options = {
    firstName: 'Fernando',
    lastName: 'Coelho',
    country: 'BRA',
  }
) {
  const {
    firstName = 'Fernando',
    lastName = 'Coelho',
    country = 'BRA',
  } = options

  const data = PROFILE_DATA[country] ?? PROFILE_DATA.BRA

  cy.get('#client-first-name').type(firstName, { force: true })

  cy.get('#client-last-name').type(lastName, { force: true })

  cy.get('#client-document').type(data.document, { force: true })

  cy.get('#client-phone').type(data.phone, { force: true })

  cy.intercept(
    'POST',
    '/api/checkout/pub/orderForm/*/attachments/clientProfileData'
  ).as('updateClientProfileData')
  cy.intercept(
    'POST',
    '/api/checkout/pub/orderForm/*/attachments/clientPreferencesData'
  ).as('updateClientPreferencesData')

  cy.get('#go-to-shipping').click()

  cy.wait('@updateClientProfileData')
  cy.wait('@updateClientPreferencesData')
}

export function getRandomEmail() {
  return `shipping${Math.random() * 100}@mailinator.com`
}

export function getSecondPurchaseEmail() {
  // there is a known issue that the same account can't make two or more
  // purchases at the same time, so in order to use test parallelization,
  // we must use different accounts each time.
  const index = getRandomInt(10, 110)

  return `second-purchase-${index}@mailinator.com`
}

export function getSecondPurchaseGeolocationEmail() {
  return 'second-purchase-geolocation@mailinator.com'
}

export function getEmailWithSomeExpiredCard() {
  return 'someexpired@mailinator.com'
}

export function getEmailWithAllExpiredCards() {
  return 'allexpired@mailinator.com'
}

export function confirmSecondPurchase() {
  cy.get('#btn-identified-user-button').click()
}

export function login(account) {
  if (account !== ACCOUNT_NAMES.INVOICE) {
    return
  }

  cy.get('#loginWithUserAndPasswordBtn').click()
  cy.get('#inputPassword').type('Abcd1234')
  cy.waitAndGet('#classicLoginBtn', 1000).click()
}

export function postProfileData({ account, profileData, orderFormId }) {
  const url = `${getBaseURL({
    ...baseConfig,
    accountName: account,
  })}/api/checkout/pub/orderForm/${orderFormId}/attachments/clientProfileData`

  cy.request('POST', url, profileData)
}
