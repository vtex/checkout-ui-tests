import { setup, visitAndClearCookies, deleteAllCookies } from "../../../utils";
import {
  fillEmail,
  confirmSecondPurchase,
  getSecondPurchaseEmail
} from "../../../utils/profile-actions";
import {
  goToPayment,
  chooseDeliveryDate
} from "../../../utils/shipping-actions";
import {
  payWithPaymentSlip,
  completePurchase
} from "../../../utils/payment-actions";

describe("Delivery + Scheduled Delivery - 2P", () => {
  before(() => {
    visitAndClearCookies();
    deleteAllCookies();
  });

  it("delivery with scheduled delivery with multiple items", () => {
    const email = getSecondPurchaseEmail();

    setup({ skus: ["35", "299"] });
    fillEmail(email);
    confirmSecondPurchase();
    chooseDeliveryDate();
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
