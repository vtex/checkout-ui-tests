import { setup, visitAndClearCookies } from "../../../../utils"
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
  login,
} from "../../../../utils/profile-actions"
import {
  fillPickupAddress,
  goToPayment,
  unavailableDeliveryGoToPickup,
  fillRemainingInfo,
  fillShippingInformation,
  chooseDeliveryDate,
} from "../../../../utils/shipping-actions"
import {
  completePurchase,
  payWithCreditCard,
} from "../../../../utils/payment-actions"
import { goToInvoiceAddress } from "../../../../utils/invoice-actions"

export default function test(account) {
  describe(`Pickup + Delivery - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("with only pickup", () => {
      const email = getRandomEmail()

      setup({ skus: ["285", "291"], account })
      fillEmail(email)
      fillProfile()
      unavailableDeliveryGoToPickup()
      fillPickupAddress(account)
      fillRemainingInfo()
      fillShippingInformation(account)
      chooseDeliveryDate()
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
      cy.contains("Copacabana").should("be.visible")
      cy.contains("Agendada").should("be.visible")
      cy.contains("Rua Saint Roman 12").should("be.visible")
      cy.contains("Copacabana").should("be.visible")
    })
  })
}
