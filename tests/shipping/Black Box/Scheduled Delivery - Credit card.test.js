import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../../../utils/profile-actions";
import {
  completePurchase,
  payWithCreditCard
} from "../../../utils/payment-actions";
import { testWrapper } from "../../../utils/testWrapper";
import {
  goToPayment,
  chooseDeliveryDate,
  fillShippingInformation
} from "../../../utils/shipping-actions";

testWrapper(account => {
  describe(`Scheduled Delivery - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("complete purchase with scheduled delivery", () => {
      const email = getRandomEmail();

      setup({ skus: ["291"], account });
      fillEmail(email);
      fillProfile();

      fillShippingInformation(account);
      chooseDeliveryDate();

      cy.get("#shipping-data")
        .contains("agendada")
        .should("be.visible");
      cy.get("#shipping-data")
        .contains("agendada-top")
        .should("be.visible");

      goToPayment();
      payWithCreditCard();
      completePurchase();

      cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
      cy.contains(email).should("be.visible");
      cy.contains("Fernando Coelho").should("be.visible");
      cy.contains("5521999999999").should("be.visible");
      cy.contains("Receber").should("be.visible");
      cy.contains("Rua Saint Roman 12").should("be.visible");
      cy.contains("Copacabana").should("be.visible");
      cy.contains("Agendada").should("be.visible");
    });
  });
});
