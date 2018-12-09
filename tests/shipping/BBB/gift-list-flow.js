import {
  getAddSkusEndpointComplete,
  getAddGiftListEndpoint,
  setup,
  visitAndClearCookies
} from "../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../utils/profile-actions";
import { payWithPaymentSlip, completePurchase } from "../utils/payment-actions";

describe("Basic Flow", () => {
  before(() => {
    visitAndClearCookies()
  });

  it("gift list with delivery", () => {
    const email = getRandomEmail();
    const sku_url = getAddSkusEndpointComplete("31");
    const url = getAddGiftListEndpoint(sku_url, '21')
    cy.wait(2000)
    setup(url, { mobile: false });

    fillEmail(email);
    fillProfile();
    payWithPaymentSlip();
    completePurchase();

    cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
    cy.contains(email).should("be.visible");
    cy.contains("Fernando Coelho").should("be.visible");
    cy.contains("Teste Endereço").should("be.visible");

  });
});
