import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../../../utils/profile-actions";
import {
  fillPickupAddress,
  goToPayment
} from "../../../utils/shipping-actions";
import {
  completePurchase,
  payWithCreditCard
} from "../../../utils/payment-actions";
import { ACCOUNT_NAMES } from "../../../utils/constants";
import { testWrapper } from "../../../utils/testWrapper";

testWrapper(account => {
  describe(`Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("with only pickup", () => {
      const email = getRandomEmail();

      setup({ skus: ["285"], account });
      fillEmail(email);
      fillProfile();
      fillPickupAddress({
        isClean: ["clean", "noLean"].some(
          localAccount => localAccount === account
        )
      });
      goToPayment();
      payWithCreditCard({ withAddress: true });
      completePurchase();

      cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
      cy.contains(email).should("be.visible");
      cy.contains("Fernando Coelho").should("be.visible");
      cy.contains("5521999999999").should("be.visible");
      cy.contains("Cartão de crédito").should("be.visible");
      cy.contains("final 8936").should("be.visible");
      cy.contains("Retirar").should("be.visible");
      cy.contains("Rua General Azevedo Pimentel 5").should("be.visible");
      cy.contains("Copacabana").should("be.visible");
    });
  });
});
