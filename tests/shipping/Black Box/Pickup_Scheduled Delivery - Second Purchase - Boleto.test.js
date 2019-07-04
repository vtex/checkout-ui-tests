import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
  login,
  getSecondPurchaseEmail,
  confirmSecondPurchase
} from "../../../utils/profile-actions";
import {
  fillPickupAddress,
  goToPayment,
  unavailableDeliveryGoToPickup,
  fillRemainingInfo,
  fillShippingInformation,
  chooseDeliveryDate
} from "../../../utils/shipping-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";
import { testWrapper } from "../../../utils/testWrapper";
import { goToInvoiceAddress } from "../../../utils/invoice-actions";

testWrapper(account => {
  describe(`Pickup + Scheduled Delivery - 2P - Boleto - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("with only pickup", () => {
      const email = getSecondPurchaseEmail();

      setup({ skus: ["285", "291"], account });
      fillEmail(email);
      confirmSecondPurchase();
      unavailableDeliveryGoToPickup();
      fillRemainingInfo();
      chooseDeliveryDate();
      goToInvoiceAddress(account);
      login(account);
      goToInvoiceAddress(account);
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
      cy.contains("Agendada").should("be.visible");
      cy.contains("Rua Saint Roman 12").should("be.visible");
      cy.contains("Copacabana").should("be.visible");
    });
  });
});
