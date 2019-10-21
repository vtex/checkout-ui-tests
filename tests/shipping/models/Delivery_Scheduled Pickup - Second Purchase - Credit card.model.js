import { setup, visitAndClearCookies } from "../../../utils"
import {
  confirmSecondPurchase,
  fillEmail,
  fillProfile,
  getSecondPurchaseEmail,
  login,
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
  typeCVV,
} from "../../../utils/payment-actions"
import { goToInvoiceAddress } from "../../../utils/invoice-actions"
import { ACCOUNT_NAMES } from "../../../utils/constants"

export default function test(account) {
  describe(`Delivery + Scheduled Pickup - 2P - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("delivery with scheduled pickup", () => {
      const email = getSecondPurchaseEmail()
      const shouldActivate = [
        ACCOUNT_NAMES.CLEAN_NO_MAPS,
        ACCOUNT_NAMES.DEFAULT,
        ACCOUNT_NAMES.GEOLOCATION,
        ACCOUNT_NAMES.INVOICE,
      ].some(localAccount => localAccount === account)

      setup({ skus: ["289", "296"], account })

      fillEmail(email)
      confirmSecondPurchase()
      unavailableDeliveryGoToPickup()
      choosePickupDate({ shouldActivate })
      fillRemainingInfo()
      goToInvoiceAddress(account)
      login(account)
      goToInvoiceAddress(account)
      goToPayment()
      typeCVV()
      completePurchase()

      cy.url({ timeout: 120000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Retirar").should("be.visible")
      cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible")
      cy.contains("Rua General Azevedo Pimentel 5").should("be.visible")
      cy.contains("Agendada").should("be.visible")
      cy.contains("Receber").should("be.visible")
      if (account === ACCOUNT_NAMES.INVOICE) {
        cy.contains("Rua Saint Roman 12").should("be.visible")
      } else {
        cy.contains("Rua ***** **man **").should("be.visible")
      }
      cy.contains("PAC").should("be.visible")
    })
  })
}
