import { ACCOUNT_NAMES, getBaseURL } from './constants'
import { baseConfig } from '.'

export function selectCountry(country) {
  cy.get('#ship-country').select(country)

  // Updating an element with a UI framework (such as React) in result of
  // another one updating it (such as our country selector updating the
  // geolocation input element) is a known issue of Cypress, so we need to wait
  // zero seconds to avoid raising a "detached element" error
  // https://github.com/cypress-io/cypress/issues/7306
  cy.wait(0)
}

export function choosePickupPoint(slaId = '') {
  cy.get(`#${slaId} .pkpmodal-pickup-point-main`).first().click()

  cy.get('.pkpmodal-details-confirm-btn').click()
}

export function chooseFirstPickupPoint() {
  cy.get('.pkpmodal-points-list .pkpmodal-pickup-point-main').first().click()

  cy.get('.pkpmodal-details-confirm-btn').click()
}

function fillPostalCodeOmnishipping(postalCode = '22071060') {
  cy.get('#ship-postalCode').type(postalCode)
}

function fillGeolocationOmnishipping() {
  cy.waitAndGet('#ship-addressQuery', 3000).type('Rua Saint Roman 12')

  cy.get('.pac-item').first().trigger('mouseover')

  cy.get('.pac-item').first().click()

  cy.contains('Rua Saint Roman 12')
}

function fillAddressInformation() {
  cy.waitAndGet('#ship-number', 3000).type('12')
}

export function fillPickupLocation({ address }) {
  cy.waitAndGet('#pkpmodal-search input', 3000).type(address)

  cy.get('.pac-item').first().trigger('mouseover', { force: true })

  cy.get('.pac-item').first().click({ force: true })
}

export function fillPickupPostalCode({ postalCode }) {
  cy.waitAndGet('#pkpmodal-search #ship-postalCode', 3000).type(postalCode)
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
  ].some((localAccount) => localAccount === account)
}

export function calculateShippingPreview() {
  cy.waitAndGet('#shipping-calculate-link', 2000).click()
}

export function unavailableDeliveryGoToPickup() {
  cy.get('.vtex-omnishipping-1-x-pickupButton').click({ force: true })
}

export function goToShippingPreviewPickup() {
  calculateShippingPreview()
  choosePickupShippingPreview()
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
  cy.get('.vtex-omnishipping-1-x-btnDelivery').click()
}

export function goToPayment() {
  cy.get('.btn-go-to-payment').should('be.visible')

  cy.wait(3000)

  cy.get('.btn-go-to-payment').focus()
  cy.get('.btn-go-to-payment').click()
}

export function chooseDelivery() {
  cy.get('#shipping-option-delivery').click()
}

export function choosePickup() {
  cy.get('#shipping-option-pickup-in-point').click()
}

export function fillShippingPreviewDelivery(account) {
  calculateShippingPreview()

  if (account === ACCOUNT_NAMES.GEOLOCATION) {
    fillGeolocationOmnishipping()
  } else {
    cy.get('#ship-postalCode').type('22071060')
    cy.wait(3000)
  }
}

export function choosePickupShippingPreview() {
  cy.waitAndGet('.srp-toggle__pickup', 3000).click()
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
    ].includes(account)
  ) {
    cy.get('#find-pickups-manualy-button-denied').click()
    fillPickupPostalCode({ postalCode: '22071060' })
  } else {
    cy.get('#find-pickups-manualy-button').click()
    fillPickupLocation({ address: 'Rua Saint Roman, 12' })
  }

  chooseFirstPickupPoint()
}

export function selectOtherPickup() {
  cy.get('#change-pickup-button').click()
  cy.get('.pkpmodal-points-list .pkpmodal-pickup-point-main').eq(1).click()
  cy.get('.pkpmodal-details-confirm-btn').click()
}

export function fillShippingPreviewPickupAddress(account, pickupPointId = '') {
  cy.get('#find-pickup-link').click()

  if (
    [
      ACCOUNT_NAMES.CLEAN_NO_MAPS,
      ACCOUNT_NAMES.NO_LEAN,
      ACCOUNT_NAMES.INVOICE,
    ].includes(account)
  ) {
    fillPickupPostalCode({ postalCode: '22071060' })
  } else {
    fillPickupLocation({ address: 'Praia de Botafogo, 300' })
  }

  if (pickupPointId) {
    choosePickupPoint(pickupPointId)
  } else {
    chooseFirstPickupPoint()
  }
}

export function checkShippingPreviewResult(selectors) {
  selectors.forEach((selector) => {
    if (selector.id) {
      cy.get(`[data-testid="${selector.id}"]`).should('be.visible')
    }

    if (selector.name) {
      cy.get('.srp-data').contains(selector.name).should('be.visible')
    }
  })
}

export function interceptAutoCompleteResponse(responseObject) {
  cy.intercept(
    {
      url: 'https://maps.googleapis.com/maps/api/place/js/PlaceService.GetPlaceDetails?*',
      times: 1,
    },
    (req) => {
      const searchParams = new URLSearchParams(req.url)
      const callbackFunctionName = searchParams.get('callback')

      req.reply(`
${callbackFunctionName} && ${callbackFunctionName}(${JSON.stringify({
        result: responseObject,
        status: 'OK',
      })})
`)
    }
  ).as('googleMapsAutocomplete')
}

export function postShippingData({ account, shippingData, orderFormId }) {
  const url = `${getBaseURL({
    ...baseConfig,
    accountName: account,
  })}/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`

  cy.request('POST', url, shippingData)
}
