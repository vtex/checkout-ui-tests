import locale from "../../src/locales/pt.json";

export const handleAddress = (
  options = { newAddress: false, desist: false }
) => {
  cy.contains("Rua ***** **man **").should("be.visible");
  cy.contains("Cop******* - Rio ** ******* - RJ").should("be.visible");

  cy.get(
    options.newAddress ? "#new-address-button" : "#edit-address-button"
  ).click();

  cy.get("#loginWithUserAndPasswordBtn").click();

  cy.get("#inputPassword").type("Abcd1234");

  cy.get("#classicLoginBtn").click();

  cy.get("#ship-postalCode")
    .clear()
    .type(options.desist ? "22" : "22250040");

  if (options.desist) {
    cy.get("#back-to-address-list").click();
  } else {
    cy.get(".address-summary");
  }
};

export const searchPickupAddress = (options = { changePickup: false }) => {
  cy.contains(locale["omnishipping.pickup"]).should("be.visible");
  cy.contains(locale["omnishipping.deliver"]).should("be.visible");

  cy.get("#shipping-option-pickup-in-point").click();

  if (options.changePickup) {
    cy.get("#change-pickup-button").click();
  } else {
    cy.get("#find-pickup-button").click();
  }

  cy.get("#pkpmodal-search input").type("Praia de Botafogo, 300");

  cy.wait(1000);
  cy.get(".pac-item");

  cy.get(".pac-item")
    .first()
    .trigger("mouseover");

  cy.get(".pac-item")
    .first()
    .click();

  cy.get(".pkpmodal-points-list #retirada-na-loja-141125d").click();

  cy.contains("Rio de Janeiro").should("be.visible");
  cy.contains("Rua General Azevedo Pimentel").should("be.visible");

  cy.get(".pkpmodal-product-item img").should("be.visible");

  cy.get("#confirm-pickup-retirada-na-loja-141125d").click();
};

export const defaultFlowModal = (options = { geolocation: false }) => {
  cy.contains(locale["omnishipping.awatingData"]).should("be.visible");

  cy.contains(locale["omnishipping.pickup"]).should("be.visible");
  cy.contains(locale["omnishipping.deliver"]).should("be.visible");
  cy.get("#shipping-option-pickup-in-point").click();

  if (options.geolocation) {
    cy.get("#find-pickups-geolocation-button").click();
  } else {
    cy.get("#find-pickups-manualy-button").click();

    cy.get("#pkpmodal-search input").type("Praia de Botafogo, 300");

    cy.get(".pac-item", { timeout: 10000 })
      .first()
      .trigger("mouseover");

    cy.get(".pac-item", { timeout: 10000 })
      .first()
      .click();
  }

  cy.contains("Rio de Janeiro").should("be.visible");

  cy.contains("Rua General Azevedo Pimentel").should("be.visible");

  cy.get(".pkpmodal-close").click();

  cy.get("#postalCode-finished-loading");

  cy.get("#shipping-option-delivery").click();

  cy.get("#ship-postalCode")
    .clear()
    .type("22251040");

  cy.get(".address-summary");

  cy.get("#ship-number")
    .type("100")
    .blur();

  cy.get("#ship-receiverName")
    .type("Fernando")
    .blur();

  cy.get(".btn-go-to-payment").click({ force: true });

  cy.contains("Em até 2 dias úteis").should("be.visible");
  cy.contains("R$ 10,00").should("be.visible");
  cy.contains("Rua Marquês de Olinda 100").should("be.visible");
  cy.contains("Botafogo - Rio de Janeiro - RJ").should("be.visible");
  cy.contains(locale["omnishipping.modifyDeliveryOptions"]).should(
    "be.visible"
  );
};
