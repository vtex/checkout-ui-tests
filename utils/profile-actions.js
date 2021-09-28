import { getRandomInt } from '.'
import { ACCOUNT_NAMES } from './constants'
import getDocument from './document-generator'

export function fillEmail(email) {
  cy.get('#cart-to-orderform').click()
  cy.get('#client-pre-email').type(email)
  cy.get('#btn-client-pre-email').click()
}

export function fillProfile(
  options = {
    lastName: 'Coelho',
  }
) {
  cy.get('#client-first-name').type('Fernando', { force: true })

  cy.get('#client-last-name').type(options.lastName, { force: true })

  cy.get('#client-document').type(getDocument(), { force: true })

  cy.get('#client-phone').type('21999999999', { force: true })

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
