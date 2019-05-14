import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../../../utils/profile-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";

describe("Gift List", () => {
  before(() => {
    visitAndClearCookies();
  });

  it("gift list with delivery", () => {
    const email = getRandomEmail();

    setup({ mobile: false, isGiftList: true, skus: ["31"] });
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
