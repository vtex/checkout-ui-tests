import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../../../utils/profile-actions";
import {
  fillPostalCodeOmnishipping,
  fillAddressInformation,
  goToPayment
} from "../../../utils/shipping-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";

describe("Delivery", () => {
  before(() => {
    visitAndClearCookies("noLean");
  });

  it("with only delivery", () => {
    const email = getRandomEmail();

    setup({ skus: ["298"], account: "noLean" });
    fillEmail(email);
    fillProfile();
    fillPostalCodeOmnishipping();
    fillAddressInformation();

    cy.get("#shipping-data")
      .contains("PAC")
      .should("be.visible");
    cy.get("#shipping-data")
      .contains("Motoboy")
      .should("be.visible");
    cy.get("#shipping-data")
      .contains("Expressa")
      .should("be.visible");
    cy.get("#shipping-data")
      .contains("PAC Lento")
      .should("be.visible");

    goToPayment();
    payWithPaymentSlip();
    completePurchase();

    cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
    cy.contains(email).should("be.visible");
    cy.contains("Fernando Coelho").should("be.visible");
    cy.contains("5521999999999").should("be.visible");
    cy.contains("Boleto bancário").should("be.visible");
    cy.contains("Receber").should("be.visible");
    cy.contains("Rua Saint Roman 12").should("be.visible");
    cy.contains("Copacabana").should("be.visible");
    cy.contains("PAC").should("be.visible");
  });
});
