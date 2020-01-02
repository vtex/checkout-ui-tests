import { ACCOUNT_NAMES } from "./constants"

function fillPostalCodeOmnishipping() {
  cy.get("#ship-postalCode").type("22071060")
}

function fillGeolocationOmnishipping() {
  cy.waitAndGet("#ship-addressQuery", 3000).type("Rua Saint Roman 12")

  cy.get(".pac-item")
    .first()
    .trigger("mouseover")

  cy.get(".pac-item")
    .first()
    .click()

  cy.contains("Rua Saint Roman 12")
}

function fillAddressInformation() {
  cy.waitAndGet("#ship-number", 3000).type("12")
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
  cy.get(".vtex-omnishipping-1-x-pickupButton").click()
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
  cy.get(".vtex-omnishipping-1-x-btnDelivery").click()
}

export function goToPayment() {
  cy.waitAndGet(".btn-go-to-payment", 3000).click()
}

export function chooseDelivery() {
  cy.get("#shipping-option-delivery").click()
}

export function choosePickup() {
  cy.get("#shipping-option-pickup-in-point").click()
}

export function fillShippingPreviewDelivery() {
  cy.get("button#shipping-calculate-link").click()

  cy.get("#ship-postalCode").type("22071060")

  cy.get("#cart-shipping-calculate").click()
}

export function choosePickupShippingPreview() {
  cy.get(".srp-toggle__pickup").click()

  cy.contains("Retirar 1 item").should("be.visible")
  cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible")
}

export function chooseDeliveryShippingPreview() {
  cy.get(".srp-toggle__delivery").click()

  cy.contains("Receber 1 item").should("be.visible")
  cy.contains("22071-060").should("be.visible")
}

export function chooseDeliveryDate({ account, shouldActivate }) {
  if (shouldActivateDatePicker({ account, shouldActivate })) {
    cy.waitAndGet("#scheduled-delivery-delivery", 1000).click()
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
    cy.waitAndGet("#scheduled-delivery-pickup-in-point", 1000).click()
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
    cy.waitAndGet("#pkpmodal-search #ship-postalCode", 3000).type("22071060")
  } else {
    cy.get("#find-pickups-manualy-button").click()
    cy.waitAndGet("#pkpmodal-search input", 3000).type("Praia de Botafogo, 300")

    cy.get(".pac-item")
      .first()
      .trigger("mouseover", { force: true })

    cy.get(".pac-item")
      .first()
      .click({ force: true })
  }
  cy.get(".pkpmodal-points-list .pkpmodal-pickup-point-main").click()

  cy.get(".pkpmodal-details-confirm-btn").click()
}
