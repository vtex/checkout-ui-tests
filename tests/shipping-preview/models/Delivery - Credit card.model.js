import { setup, visitAndClearCookies } from "../../../utils"
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from "../../../utils/profile-actions"
import {
  goToPayment,
  fillShippingPreviewDelivery,
  fillRemainingShippingInfo,
} from "../../../utils/shipping-actions"
import {
  completePurchase,
  payWithCreditCard,
} from "../../../utils/payment-actions"
import { ACCOUNT_NAMES, SKUS } from "../../../utils/constants"

export default function test(account) {
  describe(`Delivery - Credit Card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("with only delivery", () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })
      fillShippingPreviewDelivery(account)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get(".srp-content")
          .contains("PAC")
          .should("be.visible")
      } else {
        cy.waitAndGet(".srp-content", 3000)
          .contains("Mais econômica")
          .should("be.visible")
      }

      fillEmail(email)
      fillProfile()
      fillRemainingShippingInfo(account)
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 120000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Fernando Coelho").should("be.visible")
      cy.contains("5521999999999").should("be.visible")
      cy.contains("Cartão de crédito").should("be.visible")
      cy.contains("final 8936").should("be.visible")
      cy.contains("Receber").should("be.visible")
      cy.contains("Rua Saint Roman 12").should("be.visible")
      cy.contains("Copacabana").should("be.visible")
      cy.contains("PAC").should("be.visible")
    })
  })
}
