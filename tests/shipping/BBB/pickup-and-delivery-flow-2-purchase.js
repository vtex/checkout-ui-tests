import {
  clearBrowserStorage,
  getAddSkusEndpointComplete,
  setup,
  visitAndClearCookies
} from "../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
  getSecondPurchaseEmail,
  confirmSecondPurchase
} from "../utils/profile-actions";
import {
  fillShippingPreviewDelivery,
  togglePickupShippingPreview,
  toggleDeliveryShippingPreview,
  choosePickupOmnishipping,
  fillPostalCodeOmnishipping,
  fillAddressInformation,
  fillPickupAddress,
  goToPayment,
  chooseDeliveryOmnishipping
} from "../utils/shipping-actions";
import { payWithPaymentSlip, completePurchase } from "../utils/payment-actions";

describe("Basic Flow", () => {
  before(() => {
    visitAndClearCookies()
  });

  it("start with delivery then, choosing pickup, then choosing pickup", () => {
    const email = getSecondPurchaseEmail();
    const url = getAddSkusEndpointComplete("298");
    cy.wait(2000)
    setup(url, { mobile: false });
 
    fillEmail(email);
    confirmSecondPurchase();
    choosePickupOmnishipping();
    chooseDeliveryOmnishipping();
    goToPayment();
    payWithPaymentSlip();
    completePurchase();

    cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
    cy.contains(email).should("be.visible");
    cy.contains("Gab**** God**").should("be.visible");
    cy.contains("Receber").should("be.visible");

  });
});
