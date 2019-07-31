import { setup, visitAndClearCookies } from "../../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../../../../utils/profile-actions";
import {
  goToPayment,
  fillRemainingInfo,
  fillShippingInformation,
  choosePickupOmnishipping
} from "../../../../utils/shipping-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../../utils/payment-actions";
import { goToInvoiceAddress } from "../../../../utils/invoice-actions";

export default function test(account) {
  describe(`Delivery Only + Delivery/Pickup - Boleto - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("with only pickup", () => {
      const email = getRandomEmail();

      setup({ skus: ["298", "290"], account });
      fillEmail(email);
      fillProfile();
      fillShippingInformation(account);
      choosePickupOmnishipping();
      cy.get("#shipping-data")
        .contains("Loja em Copacabana no Rio de Janeiro")
        .should("be.visible");
      fillRemainingInfo();
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
      cy.contains("Receber").should("be.visible");
      cy.contains("Rua Saint Roman 12").should("be.visible");
      cy.contains("Copacabana").should("be.visible");
    });
  });
}
