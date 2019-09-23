import { setup, visitAndClearCookies } from "../../../utils"
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
} from "../../../utils/profile-actions"
import { completePurchase, payWithBoleto } from "../../../utils/payment-actions"

export default function test(account) {
  describe(`Delivery - 2P - Boleto - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("delivery with second purchase email", () => {
      const email = getSecondPurchaseEmail()

      setup({ skus: ["289"], account })
      fillEmail(email)
      confirmSecondPurchase()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Receber").should("be.visible")
      cy.contains("Boleto").should("be.visible")
      cy.contains("PAC").should("be.visible")
    })
  })
}
