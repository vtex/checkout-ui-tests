import {
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
  fillPostalCodeOmnishipping,
  fillAddressInformation,
  goToPayment
} from "../utils/shipping-actions";
import { payWithPaymentSlip, completePurchase } from "../utils/payment-actions";

describe("Basic Flow", () => {
  before(() => {
    visitAndClearCookies();
  });

  it("with only delivery", () => {
    const email = getRandomEmail();
    const url = getAddSkusEndpointComplete("31");
    cy.wait(2000);
    setup(url, { mobile: false });

    fillEmail(email);
    fillProfile();
    fillPostalCodeOmnishipping();
    fillAddressInformation();
    goToPayment();
    payWithPaymentSlip();
    completePurchase();

    cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
    cy.contains(email).should("be.visible");
    cy.contains("Fernando Coelho").should("be.visible");
    cy.contains("007.594.591-69").should("be.visible");
    cy.contains("5521999999999").should("be.visible");
    cy.contains("Boleto bancário").should("be.visible");
    cy.contains("Receber").should("be.visible");
    cy.contains("Rua Saint Roman, 12").should("be.visible");
    cy.contains("Copacabana").should("be.visible");
    cy.contains("PAC").should("be.visible");
  });
});
