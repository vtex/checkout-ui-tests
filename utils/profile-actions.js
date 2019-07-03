export function fillEmail(email) {
  cy.wait(2000);

  cy.get("#cart-to-orderform").click({ force: true });

  cy.wait(1000);

  cy.get("#client-pre-email").type(email, { force: true });
  cy.get("#btn-client-pre-email").click({ force: true });

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
  cy.get("#btn-identified-user-button").click({ force: true });
}

export function login(account) {
  if (account === "invoice") {
    cy.get("#loginWithUserAndPasswordBtn").click();
    cy.get("#inputPassword").type("Abcd1234");
    cy.get("#classicLoginBtn").click();
  }
}
