import { setup, visitAndClearCookies } from "../../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../../../../utils/profile-actions";
import {
  fillAddressInformation,
  goToPayment,
  chooseDeliveryDate,
  fillShippingInformation
} from "../../../../utils/shipping-actions";
import {
  completePurchase,
  payWithCreditCard
} from "../../../../utils/payment-actions";

export default function test(account) {
  describe(`Delivery + Scheduled Delivery - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("delivery with scheduled delivery with multiple items", () => {
      const email = getRandomEmail();

      setup({ skus: ["35", "299"], account });

      fillEmail(email);
      fillProfile();
      fillShippingInformation(account);
      chooseDeliveryDate();
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
}
