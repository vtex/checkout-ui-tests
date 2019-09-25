import { setup, visitAndClearCookies } from "../../../utils"
import {
  fillEmail,
  login,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
} from "../../../utils/profile-actions"
import {
  goToPayment,
  unavailableDeliveryGoToPickup,
  fillRemainingInfo,
  chooseDeliveryDate,
} from "../../../utils/shipping-actions"
import { completePurchase, typeCVV } from "../../../utils/payment-actions"
import { goToInvoiceAddress } from "../../../utils/invoice-actions"
import { ACCOUNT_NAMES } from "../../../utils/constants"

export default function test(account) {
  describe(`Pickup + Scheduled Delivery - 2P - Boleto - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("with only pickup", () => {
      const email = getSecondPurchaseEmail()

      setup({ skus: ["285", "291"], account })
      fillEmail(email)
      confirmSecondPurchase()
      unavailableDeliveryGoToPickup()
      fillRemainingInfo()
      chooseDeliveryDate()
      goToInvoiceAddress(account)
      login(account)
      goToInvoiceAddress(account)
      goToPayment()
      typeCVV()
      completePurchase()

      cy.url({ timeout: 120000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Retirar").should("be.visible")
      cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible")
      cy.contains("Rua General Azevedo Pimentel 5").should("be.visible")
      cy.contains("Copacabana").should("be.visible")
      cy.contains("Agendada").should("be.visible")
      if (account === ACCOUNT_NAMES.INVOICE) {
        cy.contains("Praia de Botafogo 300").should("be.visible")
      } else {
        cy.contains("Pra** ** *****ogo, ***").should("be.visible")
      }
      cy.contains("Copacabana").should("be.visible")
    })
  })
}
