import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase
} from "../../../utils/profile-actions";
import { completePurchase, typeCVV } from "../../../utils/payment-actions";
import { testWrapper } from "../../../utils/testWrapper";
import {
  chooseDeliveryDate,
  goToPayment
} from "../../../utils/shipping-actions";

testWrapper(account => {
  describe(`Scheduled Delivery - 2P - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("start with delivery then, choosing pickup, then choosing delivery", () => {
      const email = getSecondPurchaseEmail();

      setup({ skus: ["291"], account });
      fillEmail(email);
      confirmSecondPurchase();
      chooseDeliveryDate();
      goToPayment();
      typeCVV();
      completePurchase();

      cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
      cy.contains(email).should("be.visible");
      cy.contains("Gab**** God**").should("be.visible");
      cy.contains("Receber").should("be.visible");
      cy.contains("Bot*****").should("be.visible");
    });
  });
});
