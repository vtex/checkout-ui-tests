import { setup, visitAndClearCookies } from "../../../../utils"
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from "../../../../utils/profile-actions"
import {
  goToPayment,
  fillShippingInformation,
} from "../../../../utils/shipping-actions"
import {
  completePurchase,
  payWithCreditCard,
} from "../../../../utils/payment-actions"

export default function test(account) {
  describe(`Delivery - Credit Card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("with only delivery", () => {
      const email = getRandomEmail()

      setup({ skus: ["289"], account })
      fillEmail(email)
      fillProfile()
      fillShippingInformation(account)
      if (account === "noLean") {
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
      } else {
        cy.get("#shipping-data")
          .contains("Mais rápida")
          .should("be.visible")
        cy.get("#shipping-data")
          .contains("Mais econômica")
          .should("be.visible")
      }
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 60000 }).should("contain", "/orderPlaced")
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
