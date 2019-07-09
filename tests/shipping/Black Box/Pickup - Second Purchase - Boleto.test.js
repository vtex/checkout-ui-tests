import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
  login
} from "../../../utils/profile-actions";
import { goToPayment } from "../../../utils/shipping-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";
import { testWrapper } from "../../../utils/testWrapper";
import {
  goToInvoiceAddress,
  fillInvoiceAddress
} from "../../../utils/invoice-actions";

testWrapper(account => {
  describe(`Pickup - 2P - Boleto - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("start with delivery then, choosing pickup, then choosing pickup", () => {
      const email = getSecondPurchaseEmail();

      setup({ skus: ["285"], account });
      fillEmail(email);
      confirmSecondPurchase();
      goToInvoiceAddress(account);
      login(account);
      goToInvoiceAddress(account);
      goToPayment();
      payWithPaymentSlip();
      completePurchase();

      cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
      cy.contains(email).should("be.visible");
      if (account === "invoice") {
        cy.contains("Gabriel Godoy").should("be.visible");
      } else {
        cy.contains("Gab**** God**").should("be.visible");
      }
      cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible");
      cy.contains("Retirar").should("be.visible");
    });
  });
});
