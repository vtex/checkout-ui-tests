export function fillEmail(email) {
  cy.wait(1000);

  cy.get("#cart-to-orderform", { force: true }).click();

  cy.wait(1000);

  cy.get("#client-pre-email", { force: true }).type(email);
  cy.get("#btn-client-pre-email").click();

  cy.wait(1000);
}

export function fillProfile() {
  cy.get("#client-first-name")
    .should("be.visible")
    .type("Fernando");

  cy.get("#client-last-name").type("Coelho");

  cy.get("#client-document").type("00759459169");

  cy.get("#client-phone").type("21999999999");

  cy.get("#go-to-shipping").click();
}

export function getRandomEmail() {
  return `shipping${Math.random() * 100}@mailinator.com`;
}

export function getSecondPurchaseEmail() {
  return "segunda-compra@mailinator.com";
}

export function confirmSecondPurchase() {
  cy.wait(1000);
  cy.get("#btn-identified-user-button").click();
}
