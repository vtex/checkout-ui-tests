export function goToInvoiceAddress(account) {
  if (account === "invoice") {
    cy.get(".vtex-omnishipping-1-x-btnDelivery").click();
  }
}

export function fillInvoiceAddress(account) {
  if (account === "invoice") {
    cy.get(".vtex-omnishipping-1-x-addressFormPart1 #ship-postalCode").type(
      "22071060"
    );
    cy.get(".vtex-omnishipping-1-x-teste #ship-number").type("12");
  }
}
