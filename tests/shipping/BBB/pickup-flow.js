import {
  clearBrowserStorage,
  getAddSkusEndpointComplete,
  setup,
  visitAndClearCookies
} from "../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../utils/profile-actions";
import {
  fillShippingPreviewDelivery,
  togglePickupShippingPreview,
  toggleDeliveryShippingPreview,
} from "../utils/shipping-actions";
import { payWithPaymentSlip, completePurchase } from "../utils/payment-actions";

describe("Basic Flow", () => {
  before(() => {
    visitAndClearCookies()
  });

  it("start with delivery then, choosing pickup, then choosing pickup", () => {
    const email = getRandomEmail();
    const url = getAddSkusEndpointComplete("35");
    cy.wait(2000)
    setup(url, { mobile: false });

    fillShippingPreviewDelivery();
    togglePickupShippingPreview();
    toggleDeliveryShippingPreview();
    togglePickupShippingPreview();
    fillEmail(email);
    fillProfile();
    payWithPaymentSlip();
    completePurchase();

    cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
    cy.contains(email).should("be.visible");
    cy.contains("Fernando Coelho").should("be.visible");
    cy.contains("007.594.591-69").should("be.visible");
    cy.contains("5521999999999").should("be.visible");
    cy.contains("Retirar").should("be.visible");
    cy.contains("Rua Saint Roman, 12").should("be.visible");
    cy.contains("Copacabana").should("be.visible");
    cy.contains("Expressa").should("be.visible");
  });
});
