import { setup, visitAndClearCookies } from "../../../../utils"
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from "../../../../utils/profile-actions"
import {
  fillPickupAddress,
  goToPayment,
} from "../../../../utils/shipping-actions"
import {
  completePurchase,
  payWithCreditCard,
} from "../../../../utils/payment-actions"
import {
  goToInvoiceAddress,
  fillInvoiceAddress,
} from "../../../../utils/invoice-actions"

export default function test(account) {
  describe(`Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("with only pickup", () => {
      const email = getRandomEmail()

      setup({ skus: ["285"], account })
      fillEmail(email)
      fillProfile()
      fillPickupAddress(account)
      goToInvoiceAddress(account)
      fillInvoiceAddress(account)
      goToPayment()
      payWithCreditCard({ withAddress: true })
      completePurchase()

      cy.url({ timeout: 60000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Fernando Coelho").should("be.visible")
      cy.contains("5521999999999").should("be.visible")
      cy.contains("Cartão de crédito").should("be.visible")
      cy.contains("final 8936").should("be.visible")
      cy.contains("Retirar").should("be.visible")
      cy.contains("Rua General Azevedo Pimentel 5").should("be.visible")
      cy.contains("Copacabana").should("be.visible")
    })
  })
}
