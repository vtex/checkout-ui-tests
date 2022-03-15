import { ACCOUNT_NAMES } from './constants'
import { waitLoad } from '.'

const INVOICE_ACCOUNTS = [
  ACCOUNT_NAMES.INVOICE,
  ACCOUNT_NAMES.GEOLOCATION_INVOICE,
]

export function goToInvoiceAddress(account) {
  if (!INVOICE_ACCOUNTS.includes(account)) {
    return
  }

  waitLoad()
  cy.waitAndGet('.vtex-omnishipping-1-x-btnDelivery', 1000).click()
}

export function fillInvoiceAddress(account) {
  if (!INVOICE_ACCOUNTS.includes(account)) {
    return
  }

  if (account === ACCOUNT_NAMES.INVOICE) {
    cy.waitAndGet(
      '.vtex-omnishipping-1-x-addressFormPart1 #ship-postalCode',
      1000
    )
      .last()
      .clear()
      .type('22071060')
      .should('have.value', '22071-060')
  } else if (account === ACCOUNT_NAMES.GEOLOCATION_INVOICE) {
    cy.waitAndGet('#ship-addressQuery', 1000).type('Rua Saint Roman')

    cy.get('.pac-item').first().trigger('mouseover')

    cy.get('.pac-item').first().click()

    cy.contains('Rua Saint Roman')
  }

  cy.wait('@checkoutRequest')

  cy.waitAndGet('.vtex-omnishipping-1-x-teste #ship-number[type=text]', 1000)
    .last()
    .clear()
    .type('12')
}

export function invalidateInvoiceAddress(account) {
  if (!INVOICE_ACCOUNTS.includes(account)) {
    return
  }

  cy.waitAndGet('#ship-number', 1000).last().clear().blur()
  cy.get('#btn-go-to-payment').should('not.exist')
  cy.get('.ship-number .error').should('exist').contains('Campo obrigatório.')
}
