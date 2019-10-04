import { setup, visitAndClearCookies } from "../../../utils"
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from "../../../utils/profile-actions"
import {
  goToPayment,
  choosePickupDate,
  fillPickupAddress,
  fillRemainingInfo,
  fillShippingInformation,
  unavailableDeliveryGoToPickup,
} from "../../../utils/shipping-actions"
import {
  completePurchase,
  payWithCreditCard,
} from "../../../utils/payment-actions"
import { goToInvoiceAddress } from "../../../utils/invoice-actions"
import { ACCOUNT_NAMES } from "../../../utils/constants"

export default function test(account) {
  describe(`Delivery + Scheduled Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("delivery with scheduled pickup", () => {
      const email = getRandomEmail()
      const shouldActivate = [
        ACCOUNT_NAMES.CLEAN_NO_MAPS,
        ACCOUNT_NAMES.DEFAULT,
        ACCOUNT_NAMES.GEOLOCATION,
        ACCOUNT_NAMES.INVOICE,
      ].some(localAccount => localAccount === account)

      setup({ skus: ["289", "296"], account })

      fillEmail(email)
      fillProfile()
      unavailableDeliveryGoToPickup()
      fillPickupAddress(account)
      fillRemainingInfo()
      fillShippingInformation(account)
      choosePickupDate({
        shouldActivate,
      })
      goToInvoiceAddress(account)
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 120000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Fernando Coelho").should("be.visible")
      cy.contains("5521999999999").should("be.visible")
      cy.contains("Retirar").should("be.visible")
      cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible")
      cy.contains("Rua General Azevedo Pimentel 5").should("be.visible")
      cy.contains("Receber").should("be.visible")
      cy.contains("Rua Saint Roman 12").should("be.visible")
      cy.contains("PAC").should("be.visible")
    })
  })
}
