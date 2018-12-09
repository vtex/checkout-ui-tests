import {
  clearBrowserStorage,
  getAddSkusEndpointComplete,
  setup,
  visitAndClearCookies,
  deleteAllCookies
} from "../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
  getSecondPurchaseEmail,
  confirmSecondPurchase
} from "../utils/profile-actions";
import {
  fillPostalCodeOmnishipping,
  fillAddressInformation,
  goToPayment,
  choosePickupOmnishipping,
  fillShippingPreviewDelivery,
  togglePickupShippingPreview,
  toggleDeliveryShippingPreview,
  chooseDeliveryOmnishipping
} from "../utils/shipping-actions";
import {
  payWithPaymentSlip,
  completePurchase,
  payWithCreditCard
} from "../utils/payment-actions";

describe("Basic Flow", () => {

  before(() => {
    visitAndClearCookies();
    deleteAllCookies();
  });

  it("start with delivery then, choosing pickup, then choosing delivery", () => {

    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }


    const email = getSecondPurchaseEmail();
    const url = getAddSkusEndpointComplete("35");
    cy.wait(2000);
    setup(url, { mobile: false });

    fillEmail(email);
    confirmSecondPurchase();
    goToPayment();
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