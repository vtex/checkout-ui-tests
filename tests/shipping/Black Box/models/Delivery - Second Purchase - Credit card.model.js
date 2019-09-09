import { setup, visitAndClearCookies } from "../../../../utils"
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
} from "../../../../utils/profile-actions"
import { completePurchase, typeCVV } from "../../../../utils/payment-actions"

export default function test(account) {
  describe(`Delivery - 2P - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("delivery with second purchase email", () => {
      const email = getSecondPurchaseEmail()

      setup({ skus: ["289"], account })
      fillEmail(email)
      confirmSecondPurchase()
      typeCVV()
      completePurchase()

      cy.url({ timeout: 60000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Gab**** God**").should("be.visible")
      cy.contains("Receber").should("be.visible")
      cy.contains("PAC").should("be.visible")
    })
  })
}
