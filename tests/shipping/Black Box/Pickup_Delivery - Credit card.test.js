import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../../../utils/profile-actions";
import {
  fillPickupAddress,
  goToPayment,
  unavailableDeliveryGoToPickup,
  fillRemainingInfo,
  fillShippingInformation
} from "../../../utils/shipping-actions";
import {
  completePurchase,
  payWithCreditCard
} from "../../../utils/payment-actions";
import { testWrapper } from "../../../utils/testWrapper";

testWrapper(account => {
  describe(`Pickup + Delivery - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("with only pickup", () => {
      const email = getRandomEmail();

      setup({ skus: ["285", "289"], account });
      fillEmail(email);
      fillProfile();
      unavailableDeliveryGoToPickup();
      fillPickupAddress({
        isClean: ["clean", "noLean"].some(
          localAccount => localAccount === account
        )
      });
      fillRemainingInfo();
      fillShippingInformation(account);
      if (account === "noLean") {
        cy.get("#shipping-data")
          .contains("PAC")
          .should("be.visible");
        cy.get("#shipping-data")
          .contains("Motoboy")
          .should("be.visible");
        cy.get("#shipping-data")
          .contains("Expressa")
          .should("be.visible");
        cy.get("#shipping-data")
          .contains("PAC Lento")
          .should("be.visible");
      } else {
        cy.get("#shipping-data")
          .contains("Mais rápida")
          .should("be.visible");
        cy.get("#shipping-data")
          .contains("Mais econômica")
          .should("be.visible");
      }
      goToPayment();
      payWithCreditCard();
      completePurchase();

      cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
      cy.contains(email).should("be.visible");
      cy.contains("Fernando Coelho").should("be.visible");
      cy.contains("5521999999999").should("be.visible");
      cy.contains("Retirar").should("be.visible");
      cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible");
      cy.contains("Rua General Azevedo Pimentel 5").should("be.visible");
      cy.contains("Copacabana").should("be.visible");
      cy.contains("Receber").should("be.visible");
      cy.contains("Rua Saint Roman 12").should("be.visible");
      cy.contains("Copacabana").should("be.visible");
    });
  });
});
