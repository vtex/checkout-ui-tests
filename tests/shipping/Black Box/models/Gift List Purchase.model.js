import { setup, visitAndClearCookies } from "../../../../utils"
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from "../../../../utils/profile-actions"
import {
  payWithPaymentSlip,
  completePurchase,
} from "../../../../utils/payment-actions"

export default function test(account) {
  describe(`Gift List - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("gift list with delivery", () => {
      const email = getRandomEmail()

      setup({ mobile: false, isGiftList: true, skus: ["31"], account })
      fillEmail(email)
      fillProfile()
      payWithPaymentSlip()
      completePurchase()

      cy.url({ timeout: 60000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Fernando Coelho").should("be.visible")
      cy.contains("Teste Endereço").should("be.visible")
    })
  })
}
