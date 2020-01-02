import { ACCOUNT_NAMES } from "./constants"
import { waitLoad } from './'

export function goToInvoiceAddress(account) {
  if (account === ACCOUNT_NAMES.INVOICE) {
    waitLoad()
    cy.waitAndGet(".vtex-omnishipping-1-x-btnDelivery", 1000).click()
  }
}

export function fillInvoiceAddress(account) {
  if (account === ACCOUNT_NAMES.INVOICE) {
    cy.waitAndGet(".vtex-omnishipping-1-x-addressFormPart1 #ship-postalCode", 1000)
      .type("22071060")
    cy.get(".vtex-omnishipping-1-x-teste #ship-number").type("12")
  }
}
