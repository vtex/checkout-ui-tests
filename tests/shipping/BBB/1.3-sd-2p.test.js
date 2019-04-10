import { setup, visitAndClearCookies, deleteAllCookies } from "../../../utils";
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase
} from "../../../utils/profile-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";

describe("Scheduled Delivery - 2P", () => {
  before(() => {
    visitAndClearCookies();
    deleteAllCookies();
  });

  it("start with delivery then, choosing pickup, then choosing delivery", () => {
    const email = getSecondPurchaseEmail();

    setup({ skus: ["299"] });
    fillEmail(email);
    confirmSecondPurchase();
    payWithPaymentSlip();
    completePurchase();

    cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
    cy.contains(email).should("be.visible");
    cy.contains("Gab**** God**").should("be.visible");
    cy.contains("Receber").should("be.visible");
    cy.contains("Bot*****").should("be.visible");
  });
});
// OK
