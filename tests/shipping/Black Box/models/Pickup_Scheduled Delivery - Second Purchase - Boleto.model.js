import { setup, visitAndClearCookies } from "../../../../utils"
import {
  fillEmail,
  login,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
} from "../../../../utils/profile-actions"
import {
  goToPayment,
  unavailableDeliveryGoToPickup,
  fillRemainingInfo,
  chooseDeliveryDate,
} from "../../../../utils/shipping-actions"
import {
  payWithPaymentSlip,
  completePurchase,
} from "../../../../utils/payment-actions"
import { goToInvoiceAddress } from "../../../../utils/invoice-actions"

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
      payWithPaymentSlip()
      completePurchase()

      cy.url({ timeout: 60000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Gab**** God**").should("be.visible")
      cy.contains("*********2222").should("be.visible")
      cy.contains("Retirar").should("be.visible")
      cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible")
      cy.contains("Rua General Azevedo Pimentel 5").should("be.visible")
      cy.contains("Copacabana").should("be.visible")
      cy.contains("Agendada").should("be.visible")
      cy.contains("Pra** ** *****ogo, ***").should("be.visible")
      cy.contains("Copacabana").should("be.visible")
    })
  })
}
