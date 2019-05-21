import { setup, visitAndClearCookies, deleteAllCookies } from "../../../utils";
import {
  fillEmail,
  getRandomEmail,
  fillProfile
} from "../../../utils/profile-actions";
import {
  fillPostalCodeOmnishipping,
  fillAddressInformation,
  goToPayment,
  chooseDeliveryDate
} from "../../../utils/shipping-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";

describe("Delivery + Scheduled Delivery", () => {
  before(() => {
    visitAndClearCookies("noLean");
  });

  it("delivery with scheduled delivery with multiple items", () => {
    const email = getRandomEmail();

    setup({ skus: ["35", "299"], account: "noLean" });

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
    cy.contains("5521999999999").should("be.visible");
    cy.contains("Receber").should("be.visible");
    cy.contains("Rua Saint Roman 12").should("be.visible");
    cy.contains("Copacabana").should("be.visible");
    cy.contains("Agendada").should("be.visible");
  });
});