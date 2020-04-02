import { setup, visitAndClearCookies } from "../../../utils"
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from "../../../utils/profile-actions"
import {
  goToPayment,
  fillRemainingInfo,
  fillShippingInformation,
  goToShippingPreviewPickup,
  fillShippingPreviewPickupAddress,
} from "../../../utils/shipping-actions"
import {
  completePurchase,
  payWithCreditCard,
} from "../../../utils/payment-actions"
import { goToInvoiceAddress, fillInvoiceAddress } from "../../../utils/invoice-actions"
import { ACCOUNT_NAMES, SKUS } from "../../../utils/constants"

export default function test(account) {
  describe(`Pickup + Delivery - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("with only pickup", () => {
      const email = getRandomEmail()
      let options = {}

      setup({ skus: [SKUS.PICKUP_1_SLA, SKUS.DELIVERY_MULTIPLE_SLA], account })
      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)

      fillEmail(email)
      fillProfile()
      goToInvoiceAddress(account)
      if(account !== ACCOUNT_NAMES.GEOLOCATION){
        fillRemainingInfo()
        fillShippingInformation(account)
      }

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get("#shipping-data")
          .contains("PAC")
          .should("be.visible")
        cy.get("#shipping-data")
          .contains("Motoboy")
          .should("be.visible")
        cy.get("#shipping-data")
          .contains("Expressa")
          .should("be.visible")
        cy.get("#shipping-data")
          .contains("PAC Lento")
          .should("be.visible")
      } 

      if(account === ACCOUNT_NAMES.INVOICE){
        cy.get('.vtex-omnishipping-1-x-btnDelivery').click()
      }

      if(account === ACCOUNT_NAMES.GEOLOCATION){
        cy.get('#open-shipping').click()
        cy.get('#ship-addressQuery').type('Rua Saint Roman 12')
        cy.get(".pac-item")
          .first()
          .trigger("mouseover", { force: true })

        cy.get(".pac-item")
          .first()
          .click({ force: true })
      }
      goToPayment()
      payWithCreditCard(options)
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
      cy.contains("Receber").should("be.visible")
      cy.contains("Rua Saint Roman 12").should("be.visible")
      cy.contains("Copacabana").should("be.visible")
    })
  })
}
