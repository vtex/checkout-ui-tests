import { ACCOUNT_NAMES } from "./constants"

function fillPostalCodeOmnishipping() {
  cy.wait(1000)
  cy.get("#ship-postalCode").type("22071060")
}

function fillGeolocationOmnishipping() {
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

function fillAddressInformation() {
  cy.wait(2000)
  cy.get("#ship-number").type("12")
}

function shouldActivateDatePicker({ account, shouldActivate }) {
  if (shouldActivate !== undefined) {
    return shouldActivate
  }
  
  return [
    ACCOUNT_NAMES.CLEAN_NO_MAPS,
    ACCOUNT_NAMES.DEFAULT,
    ACCOUNT_NAMES.GEOLOCATION,
    ACCOUNT_NAMES.INVOICE,
  ].some(localAccount => localAccount === account)
}

export function unavailableDeliveryGoToPickup() {
  cy.wait(1000)
  cy.get(".vtex-omnishipping-1-x-pickupButton").click({ force: true })
}

export function fillShippingInformation(account) {
  if (account === ACCOUNT_NAMES.GEOLOCATION) {
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

export function chooseDelivery() {
  cy.get("#shipping-option-delivery").click()
}

export function choosePickup() {
  cy.wait(1000)
  cy.get("#shipping-option-pickup-in-point").click()
}

export function fillShippingPreviewDelivery() {
  cy.wait(1000)
  cy.get("button#shipping-calculate-link").click()

  cy.get("#ship-postalCode").type("22071060")

  cy.get("#cart-shipping-calculate").click()
}

export function choosePickupShippingPreview() {
  cy.get(".srp-toggle__pickup").click()

  cy.wait(1000)
  cy.contains("Retirar 1 item").should("be.visible")
  cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible")
}

export function chooseDeliveryShippingPreview() {
  cy.get(".srp-toggle__delivery").click()

  cy.wait(1000)
  cy.contains("Receber 1 item").should("be.visible")
  cy.contains("22071-060").should("be.visible")

  cy.wait(1000)
}

export function chooseDeliveryDate({ account, shouldActivate }) {
  if (shouldActivateDatePicker({ account, shouldActivate })) {
    cy.get("#scheduled-delivery-delivery").wait(1000).click()
  }

  cy.get(".shp-datepicker-button")
    .filter(
      (_, $button) =>
        $button.id && $button.id.includes("scheduled-delivery-choose-agendada")
    )
    .click()
  
  cy.get(".react-datepicker__day--keyboard-selected").click()
}

export function choosePickupDate({ account, shouldActivate }) {
  if (shouldActivateDatePicker({ account, shouldActivate })) {
    cy.get("#scheduled-delivery-pickup-in-point").wait(1000).click()
  }

  cy.get(".shp-datepicker-button")
    .filter(
      (_, $button) => 
        $button.id && $button.id.includes("scheduled-delivery-choose-pickup")
    )
    .click()

  cy.get(".react-datepicker__day--keyboard-selected").click()
}

export function fillPickupAddress(account) {
  if (
    [
      ACCOUNT_NAMES.CLEAN_NO_MAPS,
      ACCOUNT_NAMES.NO_LEAN,
      ACCOUNT_NAMES.INVOICE,
    ].some(localAccount => localAccount === account)
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
  cy.get(".pkpmodal-points-list .pkpmodal-pickup-point-main").click()

  cy.get(".pkpmodal-details-confirm-btn").click()
}
