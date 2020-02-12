import { ACCOUNT_NAMES } from './constants'

export function fillEmail(email) {
  cy.get('#cart-to-orderform').click()
  cy.get('#client-pre-email').type(email)
  cy.get('#btn-client-pre-email').click()
}

export function fillProfile() {
  cy.get('#client-first-name').type('Fernando')
  cy.get('#client-last-name').type('Coelho')
  cy.get('#client-document').type('00759459169')
  cy.get('#client-phone').type('21999999999')
  cy.get('#go-to-shipping').click()
}

export function getRandomEmail() {
  return `shipping${Math.random() * 100}@mailinator.com`
}

export function getSecondPurchaseEmail() {
  return 'second-purchase-4@mailinator.com'
}

export function getSecondPurchaseGeolocationEmail() {
  return 'second-purchase-geolocation@mailinator.com'
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
