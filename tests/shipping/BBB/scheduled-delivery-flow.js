import {
  clearBrowserStorage,
  getAddSkusEndpointComplete,
  setup,
  visitAndClearCookies,
  deleteAllCookies,
} from "../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
  getSecondPurchaseEmail
} from "../utils/profile-actions";
import {
  fillPostalCodeOmnishipping,
  fillAddressInformation,
  goToPayment,
  choosePickupOmnishipping,
  fillShippingPreviewDelivery,
  togglePickupShippingPreview,
  toggleDeliveryShippingPreview,
  chooseDeliveryOmnishipping,
  chooseDeliveryDate
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


    const email = getRandomEmail();
    const url = getAddSkusEndpointComplete("299");
    cy.wait(2000);
    setup(url, { mobile: false });

    fillEmail(email);
    fillProfile();
    fillPostalCodeOmnishipping();
    chooseDeliveryDate();
    fillAddressInformation();
    goToPayment();
    payWithPaymentSlip();
    completePurchase();

    cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
    cy.contains(email).should("be.visible");
    cy.contains("Fernando Coelho").should("be.visible");
    cy.contains("007.594.591-69").should("be.visible");
    cy.contains("5521999999999").should("be.visible");
    cy.contains("Receber").should("be.visible");
    cy.contains("Rua Saint Roman, 12").should("be.visible");
    cy.contains("Copacabana").should("be.visible");
    cy.contains("Agendada").should("be.visible");
  });
});
// OK 