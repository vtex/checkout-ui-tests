import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
  getRandomEmail,
  fillProfile
} from "../../../utils/profile-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";
import { testWrapper } from "../../../utils/testWrapper";
import {
  fillGeolocationOmnishipping,
  fillPostalCodeOmnishipping,
  fillAddressInformation,
  goToPayment,
  chooseDeliveryDate
} from "../../../utils/shipping-actions";

testWrapper(account => {
  describe(`Scheduled Delivery - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("complete purchase with scheduled delivery", () => {
      const email = getRandomEmail();

      setup({ skus: ["299"], account });
      fillEmail(email);
      fillProfile();

      if (account === "geolocation") {
        fillGeolocationOmnishipping();
      } else {
        fillPostalCodeOmnishipping();
        fillAddressInformation();
      }
      chooseDeliveryDate();

      cy.get("#shipping-data")
        .contains("agendada")
        .should("be.visible");
      cy.get("#shipping-data")
        .contains("agendada-top")
        .should("be.visible");

      goToPayment();
      payWithPaymentSlip();
      completePurchase();

      cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
      cy.contains(email).should("be.visible");
      cy.contains("Fernando Coelho").should("be.visible");
      cy.contains("5521999999999").should("be.visible");
      cy.contains("Boleto bancário").should("be.visible");
      cy.contains("Receber").should("be.visible");
      cy.contains("Rua Saint Roman 12").should("be.visible");
      cy.contains("Copacabana").should("be.visible");
      cy.contains("Agendada").should("be.visible");
      cy.contains("Entre 09:00 e 21:00").should("be.visible");
    });
  });
});
