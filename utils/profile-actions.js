import { ACCOUNT_NAMES } from './constants'
import getDocument from './document-generator'

export function fillEmail(email) {
  cy.get('#cart-to-orderform').click()
  cy.get('#client-pre-email').type(email)
  cy.wait(3000)
  cy.get('#btn-client-pre-email').click()
}

export function fillProfile(
  options = {
    lastName: 'Coelho',
  }
) {
  cy.get('#client-first-name').type('Fernando', { force: true })

  cy.get('#client-last-name').type(options.lastName, { force: true })
  cy.wait(3000)
  cy.get('#client-document').type(getDocument(), { force: true })

  cy.get('#client-phone').type('21999999999', { force: true })
  cy.get(3000)
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
