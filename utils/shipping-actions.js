export function fillPostalCodeOmnishipping() {
  cy.wait(1000)
  cy.get("#ship-postalCode").type("22071060")
}

export function fillGeolocationOmnishipping() {
  cy.wait(2000)

  cy.get("#ship-addressQuery").type("Rua Saint Roman 12")

  cy.get(".pac-item")
    .first()
    .trigger("mouseover")

  cy.get(".pac-item")
    .first()
    .click()

  cy.wait(2000)
  cy.contains("Rua Saint Roman 12")
}

export function fillAddressInformation() {
  cy.wait(2000)
  cy.get("#ship-number").type("12")
}

export function unavailableDeliveryGoToPickup() {
  cy.wait(1000)
  cy.get(".vtex-omnishipping-1-x-pickupButton").click({ force: true })
}

export function fillShippingInformation(account) {
  if (account === "geolocation") {
    fillGeolocationOmnishipping()
  } else {
    fillPostalCodeOmnishipping()
    fillAddressInformation()
  }
}

export function fillRemainingInfo() {
  cy.wait(1000)
  cy.get(".vtex-omnishipping-1-x-btnDelivery").click({ force: true })
}

export function goToPayment() {
  cy.wait(1000)
  cy.get(".btn-go-to-payment").click({ force: true })
}

export function chooseDeliveryOmnishipping() {
  cy.get("#shipping-option-delivery").click()
}

export function choosePickupOmnishipping() {
  cy.wait(1000)
  cy.get("#shipping-option-pickup-in-point").click()
}

export function fillShippingPreviewDelivery() {
  cy.wait(1000)
  cy.get("button#shipping-calculate-link").click()

  cy.get("#ship-postalCode").type("22071060")

  cy.get("#cart-shipping-calculate").click()
}

export function togglePickupShippingPreview() {
  cy.get(".srp-toggle__pickup").click()

  cy.wait(1000)
  cy.contains("Retirar 1 item").should("be.visible")
  cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible")
}

export function toggleDeliveryShippingPreview() {
  cy.get(".srp-toggle__delivery").click()

  cy.wait(1000)
  cy.contains("Receber 1 item").should("be.visible")
  cy.contains("22071-060").should("be.visible")

  cy.wait(1000)
}

export function chooseDeliveryDate(options = { shouldActivate: false }) {
  if (options.shouldActivate) {
    cy.wait(3000)
    cy.get("#scheduled-delivery-delivery").click()
  }
  cy.wait(3000)
  cy.get(".scheduled-delivery-choose").click({ force: true })
  cy.get(".react-datepicker__day--keyboard-selected").click({ force: true })
}

export function fillPickupAddress(account) {
  if (
    ["clean", "noLean", "invoice"].some(
      localAccount => localAccount === account
    )
  ) {
    cy.get("#find-pickups-manualy-button-denied").click()
    cy.get("#pkpmodal-search #ship-postalCode").type("22071060")
  } else {
    cy.get("#find-pickups-manualy-button").click()
    cy.get("#pkpmodal-search input").type("Praia de Botafogo, 300")

    cy.get(".pac-item")
      .first()
      .trigger("mouseover")

    cy.get(".pac-item")
      .first()
      .click()
  }
  cy.get(".pkpmodal-points-list #retirada-na-loja-141125d").click()

  cy.get("#confirm-pickup-retirada-na-loja-141125d").click()
}
