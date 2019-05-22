import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../../../utils/profile-actions";
import {
  fillPostalCodeOmnishipping,
  fillAddressInformation,
  goToPayment,
  fillGeolocationOmnishipping,
  fillShippingInformation
} from "../../../utils/shipping-actions";
import {
  completePurchase,
  payWithCreditCard
} from "../../../utils/payment-actions";
import { testWrapper } from "../../../utils/testWrapper";

testWrapper(account => {
  describe(`Delivery - Credit Card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("with only delivery", () => {
      const email = getRandomEmail();

      setup({ skus: ["289"], account });
      fillEmail(email);
      fillProfile();
      fillShippingInformation(account);
      goToPayment();
      payWithCreditCard();
      completePurchase();

      cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
      cy.contains(email).should("be.visible");
      cy.contains("Fernando Coelho").should("be.visible");
      cy.contains("5521999999999").should("be.visible");
      cy.contains("Cartão de crédito").should("be.visible");
      cy.contains("final 8936").should("be.visible");
      cy.contains("Receber").should("be.visible");
      cy.contains("Rua Saint Roman 12").should("be.visible");
      cy.contains("Copacabana").should("be.visible");
      cy.contains("PAC").should("be.visible");
    });
  });
});
