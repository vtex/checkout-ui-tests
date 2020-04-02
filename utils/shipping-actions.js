import { ACCOUNT_NAMES } from './constants'

function fillPostalCodeOmnishipping() {
  cy.get('#ship-postalCode').type('22071060')
}

function fillGeolocationOmnishipping() {
  cy.waitAndGet('#ship-addressQuery', 3000).type('Rua Saint Roman 12')

  cy.get('.pac-item')
    .first()
    .trigger('mouseover')

  cy.get('.pac-item')
    .first()
    .click()

  cy.contains('Rua Saint Roman 12')
}

function fillAddressInformation() {
  cy.waitAndGet("#ship-postalCode", 1000)
  cy.waitAndGet("#ship-number", 3000).type("12", { force: true })
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
  cy.get('.vtex-omnishipping-1-x-pickupButton').click()
}

export function goToShippingPreviewPickup() {
  cy.waitAndGet("#shipping-calculate-link", 2000).click()
  cy.waitAndGet(".srp-toggle__pickup", 1000).click()
}

export function fillShippingInformation(account) {
  if (account === ACCOUNT_NAMES.GEOLOCATION) {
    fillGeolocationOmnishipping()
  } else {
    fillPostalCodeOmnishipping()
    fillAddressInformation()
  }
}

export function fillRemainingShippingInfo(account) {
  if (account !== ACCOUNT_NAMES.GEOLOCATION) {
    fillAddressInformation()
  }
}

export function fillRemainingInfo() {
  cy.get('.vtex-omnishipping-1-x-btnDelivery').click()
}

export function goToPayment() {
  cy.waitAndGet('.btn-go-to-payment', 3000).click()
}

export function chooseDelivery() {
  cy.get('#shipping-option-delivery').click()
}

export function choosePickup() {
  cy.waitAndGet("#shipping-option-pickup-in-point", 1000).click()
}

export function fillShippingPreviewDelivery(account) {
  cy.get("button#shipping-calculate-link").click()
  cy.wait(3000)

  if (account === ACCOUNT_NAMES.GEOLOCATION) {
    fillGeolocationOmnishipping()
  } else {
    cy.get("#ship-postalCode").type("22071060")
    cy.wait(3000)
    // cy.get("#cart-shipping-calculate").click()
  }
}

export function choosePickupShippingPreview() {
  cy.waitAndGet(".srp-toggle__pickup", 3000).click()

  cy.get(".srp-data")
    .contains("Retirar 1 item")
    .should("be.visible")
  cy.get(".srp-data")
    .contains("Loja em Copacabana no Rio de Janeiro")
    .should("be.visible")
}

export function chooseDeliveryShippingPreview() {
  cy.get('.srp-toggle__delivery').click()

  cy.contains('Receber 1 item').should('be.visible')
  cy.contains('22071-060').should('be.visible')
}

export function chooseDeliveryDate({ account, shouldActivate }) {
  chooseDate({ account, shouldActivate }, '#scheduled-delivery-delivery')
}

export function choosePickupDate({ account, shouldActivate }) {
  chooseDate(
    { account, shouldActivate },
    '#scheduled-delivery-pickup-in-point',
    'pickup'
  )
}

export function chooseDate(
  { account, shouldActivate },
  toggleElementId,
  buttonSpecificId = ''
) {
  if (shouldActivateDatePicker({ account, shouldActivate })) {
    cy.waitAndGet(toggleElementId, 1000).click()
  }

  cy.get('.shp-datepicker-button')
    .filter(
      (_, $button) =>
        $button.id &&
        $button.id.includes(`scheduled-delivery-choose-${buttonSpecificId}`)
    )
    .click()

  cy.get('.react-datepicker__day--keyboard-selected').click()
}

export function fillPickupAddress(account) {
  if (
    [
      ACCOUNT_NAMES.CLEAN_NO_MAPS,
      ACCOUNT_NAMES.NO_LEAN,
      ACCOUNT_NAMES.INVOICE,
    ].some(localAccount => localAccount === account)
  ) {
    cy.get('#find-pickups-manualy-button-denied').click()
    cy.waitAndGet('#pkpmodal-search #ship-postalCode', 3000).type('22071060')
  } else {
    cy.get('#find-pickups-manualy-button').click()
    cy.waitAndGet('#pkpmodal-search input', 3000).type('Rua Saint Roman, 12')

    cy.get('.pac-item')
      .first()
      .trigger('mouseover', { force: true })

    cy.get('.pac-item')
      .first()
      .click({ force: true })
  }
  cy.get('.pkpmodal-points-list .pkpmodal-pickup-point-main')
    .first()
    .click()

  cy.get('.pkpmodal-details-confirm-btn').click()
}

export function selectOtherPickup() {
  cy.get('#change-pickup-button').click()
  cy.get('.pkpmodal-points-list .pkpmodal-pickup-point-main')
    .eq(1)
    .click()
  cy.get('.pkpmodal-details-confirm-btn').click()
}

export function fillShippingPreviewPickupAddress(account) {
  cy.get("#find-pickup-link").click()

  if (
    [
      ACCOUNT_NAMES.CLEAN_NO_MAPS,
      ACCOUNT_NAMES.NO_LEAN,
      ACCOUNT_NAMES.INVOICE,
    ].some(localAccount => localAccount === account)
  ) {
    cy.waitAndGet("#pkpmodal-search #ship-postalCode", 3000).type("22071060")
  } else {
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
