import { ACCOUNT_NAMES } from "./constants"

export function goToInvoiceAddress(account) {
  if (account === ACCOUNT_NAMES.INVOICE) {
    cy.wait(2000)
    cy.get(".vtex-omnishipping-1-x-btnDelivery").click({ force: true })
  }
}

export function fillInvoiceAddress(account) {
  if (account === ACCOUNT_NAMES.INVOICE) {
    cy.wait(1000)
    cy.get(".vtex-omnishipping-1-x-addressFormPart1 #ship-postalCode").type(
      "22071060"
    )
    cy.get(".vtex-omnishipping-1-x-teste #ship-number").type("12")
  }
}
