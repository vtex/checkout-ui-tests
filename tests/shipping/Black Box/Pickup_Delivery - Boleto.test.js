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
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";
import { testWrapper } from "../../../utils/testWrapper";

testWrapper(account => {
  describe(`Pickup + Delivery - ${account}`, () => {
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
      goToPayment();
      payWithPaymentSlip();
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
