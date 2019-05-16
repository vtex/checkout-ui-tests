import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../../../utils/profile-actions";
import {
  fillPostalCodeOmnishipping,
  fillAddressInformation,
  goToPayment,
  fillGeolocationOmnishipping
} from "../../../utils/shipping-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";

describe("Delivery", () => {
  before(() => {
    visitAndClearCookies("geolocation");
  });

  it("with only delivery", () => {
    const email = getRandomEmail();

    setup({ skus: ["31"], account: "geolocation" });
    fillEmail(email);
    fillProfile();
    fillGeolocationOmnishipping();
    goToPayment();
    payWithPaymentSlip();
    completePurchase();

    cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
    cy.contains(email).should("be.visible");
    cy.contains("Fernando Coelho").should("be.visible");
    cy.contains("5521999999999").should("be.visible");
    cy.contains("Boleto bancário").should("be.visible");
    cy.contains("Receber").should("be.visible");
    cy.contains("Praia de Botafogo 300").should("be.visible");
    cy.contains("Botafogo").should("be.visible");
    cy.contains("PAC").should("be.visible");
  });
});
