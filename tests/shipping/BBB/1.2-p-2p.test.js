import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase
} from "../../../utils/profile-actions";
import {
  choosePickupOmnishipping,
  goToPayment,
  chooseDeliveryOmnishipping
} from "../../../utils/shipping-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";

describe("Pickup - 2P", () => {
  before(() => {
    visitAndClearCookies();
  });

  it("start with delivery then, choosing pickup, then choosing pickup", () => {
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
    cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible");
    cy.contains("Retirar").should("be.visible");
  });
});
