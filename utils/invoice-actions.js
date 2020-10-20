import { ACCOUNT_NAMES } from './constants'
import { waitLoad } from '.'

export function goToInvoiceAddress(account) {
  if (account !== ACCOUNT_NAMES.INVOICE) {
    return
  }

  waitLoad()
  cy.waitAndGet('.vtex-omnishipping-1-x-btnDelivery', 1000).click()
}

export function fillInvoiceAddress(account) {
  if (account !== ACCOUNT_NAMES.INVOICE) {
    return
  }

  cy.waitAndGet(
    '.vtex-omnishipping-1-x-addressFormPart1 #ship-postalCode',
    1000
  )
    .last()
    .clear()
    .type('22071060')
    .should('have.value', '22071-060')

  cy.wait('@checkoutRequest')

  cy.waitAndGet('.vtex-omnishipping-1-x-teste #ship-number', 1000)
    .last()
    .clear()
    .type('12')
}

export function invalidateInvoiceAddress(account) {
  if (account !== ACCOUNT_NAMES.INVOICE) {
    return
  }

  cy.waitAndGet('#ship-number', 1000)
    .last()
    .clear()
    .blur()
  cy.get('#btn-go-to-payment').should('not.exist')
  cy.get('.ship-number .error')
    .should('exist')
    .contains('Campo obrigatório.')
}
