import { setup, visitAndClearCookies } from "../../../utils"
import {
  fillEmail,
  confirmSecondPurchase,
  getSecondPurchaseEmail,
} from "../../../utils/profile-actions"
import {
  goToPayment,
  chooseDeliveryDate,
} from "../../../utils/shipping-actions"
import { completePurchase, typeCVV } from "../../../utils/payment-actions"
import { ACCOUNT_NAMES } from "../../../utils/constants"

export default function test(account) {
  describe(`Delivery + Scheduled Delivery - 2P - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("delivery with scheduled delivery with multiple items", () => {
      const email = getSecondPurchaseEmail()

      const shouldActivate = [
        ACCOUNT_NAMES.CLEAN_NO_MAPS,
        ACCOUNT_NAMES.DEFAULT,
        ACCOUNT_NAMES.GEOLOCATION,
        ACCOUNT_NAMES.INVOICE,
      ].some(localAccount => localAccount === account)
      setup({ skus: ["35", "299"], account })
      fillEmail(email)
      confirmSecondPurchase()
      chooseDeliveryDate({ shouldActivate })
      goToPayment()
      typeCVV()
      completePurchase()

      cy.url({ timeout: 120000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Receber").should("be.visible")
      cy.contains("Bot*****").should("be.visible")
    })
  })
}
