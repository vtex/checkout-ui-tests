import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../../../utils/profile-actions";
import {
  fillShippingPreviewDelivery,
  togglePickupShippingPreview,
  goToPayment
} from "../../../utils/shipping-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";

describe("Pickup - Shipping Preview", () => {
  before(() => {
    visitAndClearCookies();
  });

  it("start with delivery then, choosing pickup, then choosing pickup", () => {
    const email = getRandomEmail();

    setup({ skus: ["35"] });
    fillShippingPreviewDelivery();
    togglePickupShippingPreview();
    fillEmail(email);
    fillProfile();
    goToPayment();
    payWithPaymentSlip();
    completePurchase();

    cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
    cy.contains(email).should("be.visible");
    cy.contains("Fernando Coelho").should("be.visible");
    cy.contains("5521999999999").should("be.visible");
    cy.contains("Retirar").should("be.visible");
    cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible");
    cy.contains("Copacabana").should("be.visible");
  });
});
