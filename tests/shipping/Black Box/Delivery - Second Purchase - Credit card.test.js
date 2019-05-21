import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase
} from "../../../utils/profile-actions";
import { completePurchase, typeCVV } from "../../../utils/payment-actions";

import { testWrapper } from "../../../utils/testWrapper";

testWrapper(account => {
  describe(`Delivery - 2P - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("delivery with second purchase email", () => {
      const email = getSecondPurchaseEmail();

      setup({ skus: ["289"], account });
      fillEmail(email);
      confirmSecondPurchase();
      typeCVV();
      completePurchase();

      cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
      cy.contains(email).should("be.visible");
      cy.contains("Gab**** God**").should("be.visible");
      cy.contains("Receber").should("be.visible");
      cy.contains("PAC").should("be.visible");
    });
  });
});
