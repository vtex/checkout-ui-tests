import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
  login
} from "../../../utils/profile-actions";
import {
  goToPayment,
  unavailableDeliveryGoToPickup,
  fillRemainingInfo
} from "../../../utils/shipping-actions";
import {
  completePurchase,
  payWithCreditCard,
  typeCVV
} from "../../../utils/payment-actions";
import { testWrapper } from "../../../utils/testWrapper";
import { goToInvoiceAddress } from "../../../utils/invoice-actions";

testWrapper(account => {
  describe(`Pickup + Delivery - 2P - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("with only pickup", () => {
      const email = getSecondPurchaseEmail();

      setup({ skus: ["285", "289"], account });
      fillEmail(email);
      confirmSecondPurchase();
      unavailableDeliveryGoToPickup();

      cy.get("#shipping-data")
        .contains("Loja em Copacabana no Rio de Janeiro")
        .should("be.visible");

      fillRemainingInfo();
      goToInvoiceAddress(account);
      login(account);
      goToInvoiceAddress(account);

      cy.get("#shipping-data")
        .contains("Pra** ** *****ogo ***")
        .should("be.visible");
      cy.get("#shipping-data")
        .contains("Bot***** - Rio ** ******* - RJ")
        .should("be.visible");
      cy.get("#shipping-data")
        .contains("******040")
        .should("be.visible");

      goToPayment();
      typeCVV();
      completePurchase();

      cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
      cy.contains(email).should("be.visible");
      cy.contains("Gab**** God**").should("be.visible");
      cy.contains("Retirar").should("be.visible");
      cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible");
      cy.contains("Rua General Azevedo Pimentel 5").should("be.visible");
      cy.contains("Copacabana").should("be.visible");
      cy.contains("Receber").should("be.visible");
      cy.contains("Pra** ** *****ogo, ***").should("be.visible");
    });
  });
});
