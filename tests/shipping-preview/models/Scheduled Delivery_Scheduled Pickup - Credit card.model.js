import { setup, visitAndClearCookies } from "../../../utils"
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from "../../../utils/profile-actions"
import {
  completePurchase,
  payWithCreditCard,
} from "../../../utils/payment-actions"
import {
  chooseDeliveryDate,
  choosePickupDate,
  fillRemainingInfo,
  fillShippingInformation,
  goToPayment,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from "../../../utils/shipping-actions"
import { goToInvoiceAddress } from "../../../utils/invoice-actions"
import { SKUS, ACCOUNT_NAMES } from "../../../utils/constants"

export default function test(account) {
  describe(`Scheduled Delivery + Scheduled Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("scheduled delivery with scheduled pickup", () => {
      const email = getRandomEmail()

      setup({
        skus: [SKUS.SCHEDULED_DELIVERY, SKUS.SCHEDULED_PICKUP],
        account,
      })

      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)
      cy.contains("Retirar").should("be.visible")
      cy.contains("Receber").should("be.visible")
      fillEmail(email)
      fillProfile()

      fillRemainingInfo()

      fillShippingInformation(account)
      choosePickupDate({ account })
      chooseDeliveryDate({ account })

      goToInvoiceAddress(account)
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 120000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Fernando Coelho").should("be.visible")
      cy.contains("5521999999999").should("be.visible")
      cy.contains("Receber").should("be.visible")
      cy.contains("Rua Saint Roman 12").should("be.visible")
      cy.contains("Agendada").should("be.visible")
      cy.contains("Retirar").should("be.visible")
      cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible")
      cy.contains("Rua General Azevedo Pimentel 5").should("be.visible")
    })
  })
}
