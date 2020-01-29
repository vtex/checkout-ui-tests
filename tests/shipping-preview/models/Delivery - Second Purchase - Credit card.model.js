import { setup, visitAndClearCookies } from "../../../utils"
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
} from "../../../utils/profile-actions"
import { completePurchase, typeCVV } from "../../../utils/payment-actions"
import { SKUS, ACCOUNT_NAMES } from "../../../utils/constants"
import { fillShippingPreviewDelivery } from "../../../utils/shipping-actions"

export default function test(account) {
  describe(`Delivery - 2P - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("delivery with second purchase email", () => {
      const email = getSecondPurchaseEmail()

      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })
      fillShippingPreviewDelivery(account)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get(".srp-content")
          .contains("PAC")
          .should("be.visible")
      } else {
        cy.get(".srp-content")
          .contains("Mais econômica")
          .should("be.visible")
      }
      fillEmail(email)
      confirmSecondPurchase()
      typeCVV()
      completePurchase()

      cy.url({ timeout: 120000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Receber").should("be.visible")
      cy.contains("PAC").should("be.visible")
    })
  })
}
