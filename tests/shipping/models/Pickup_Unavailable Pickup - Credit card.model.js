import { setup, visitAndClearCookies } from "../../../utils"
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from "../../../utils/profile-actions"
import { fillPickupAddress, goToPayment } from "../../../utils/shipping-actions"
import {
  completePurchase,
  payWithCreditCard,
} from "../../../utils/payment-actions"
import {
  goToInvoiceAddress,
  fillInvoiceAddress,
} from "../../../utils/invoice-actions"
import { ACCOUNT_NAMES, SKUS } from "../../../utils/constants"
import { removeUnavailablePickups } from "../../../utils/items-actions"

export default function test(account) {
  describe(`Pickup + Pickup Unavailable - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("with only pickup", () => {
      const email = getRandomEmail()

      setup({
        skus: [SKUS.PICKUP_RJ, SKUS.PICKUP_RJ_BARRA],
        account,
      })
      fillEmail(email)
      fillProfile()
      fillPickupAddress(account)
      removeUnavailablePickups()
      goToInvoiceAddress(account)
      fillInvoiceAddress(account)
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
      cy.contains("Retirar").should("be.visible")
      cy.contains("Rua Marquês de Abrantes 5").should("be.visible")
      cy.contains("Flamengo").should("be.visible")
    })
  })
}
