import { setup, visitAndClearCookies } from "../../../utils"
import {
  fillEmail,
  confirmSecondPurchase,
  getSecondPurchaseGeolocationEmail,
} from "../../../utils/profile-actions"
import { completePurchase, payWithBoleto } from "../../../utils/payment-actions"

export default function test(account) {
  describe(`Delivery - 2P - Boleto - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("delivery with second purchase email", () => {
      const email = getSecondPurchaseGeolocationEmail()

      setup({ skus: ["312"], account, salesChannel: 2 })
      fillEmail(email)
      confirmSecondPurchase()
      payWithBoleto()

      cy.get("#shipping-data")
        .contains("21")
        .should("be.visible")

      completePurchase()

      cy.url({ timeout: 120000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Boleto").should("be.visible")
    })
  })
}
