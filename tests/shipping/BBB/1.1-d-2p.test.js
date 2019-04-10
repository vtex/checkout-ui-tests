import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase
} from "../../../utils/profile-actions";
import { goToPayment } from "../../../utils/shipping-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";

describe("Delivery - 2P", () => {
  before(() => {
    visitAndClearCookies();
  });

  it("delivery with second purchase email", () => {
    const email = getSecondPurchaseEmail();

    setup({ skus: ["285"] });
    fillEmail(email);
    confirmSecondPurchase();
    goToPayment();
    payWithPaymentSlip();
    completePurchase();

    cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
    cy.contains(email).should("be.visible");
    cy.contains("Gab**** God**").should("be.visible");
    cy.contains("Retirar").should("be.visible");
  });
});

// OK
