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

// Selecting a pickup point in the modal is a three-step async dance — the list
// loads/sorts by distance, clicking a point loads its details panel, and
// confirming commits the choice via a shippingData update. Without settle time
// between these steps the confirm can commit the modal's *default* point
// instead of the one just clicked, intermittently placing the order at the
// wrong store (e.g. the free Botafogo at 4.2km instead of the asserted
// Copacabana at 2km). This race is shared by every pickup test that asserts the
// closest store, so the waits live here in the common helper.
export function chooseFirstPickupPoint() {
  cy.get('.pkpmodal-points-list .pkpmodal-pickup-point-main', {
    timeout: 20000,
  }).should('have.length.greaterThan', 0)

  cy.get('.pkpmodal-points-list .pkpmodal-pickup-point-main').first().click()

  // Let the clicked point's details panel bind before confirming, otherwise the
  // confirm commits the modal's default point.
  cy.wait(2000)
  cy.get('.pkpmodal-details-confirm-btn').should('be.visible').click()

  // Let the pickup selection's shippingData update commit before the flow moves
  // on (a following recompute can otherwise race the in-flight selection).
  cy.wait(3000)
}

function fillPostalCodeOmnishipping(postalCode = '22071060') {
  cy.get('#ship-postalCode').type(postalCode)
}

// Wait for the Google Places autocomplete dropdown to render and stabilize.
// Under load the `.pac-container` can be present-but-hidden (display:none while
// predictions/quota are pending) and `GetPredictions` may re-render the list
// mid-interaction, detaching rows. Assert the container is visible and
// populated, then let it settle before any selection.
export function waitForPacItems() {
  cy.get('.pac-container:visible', { timeout: 20000 })
  cy.get('.pac-item', { timeout: 20000 }).should('have.length.greaterThan', 0)
  cy.wait(500)
}

// Robustly pick a Google Places prediction. Waits for the dropdown to
// stabilize, then selects the item matching `matchText` (case-insensitive
// substring) or the first item when no text is given. Re-queries between the
// hover and the click so a late list re-render doesn't act on a detached node;
// `force` bypasses the transient actionability blocks the dropdown is prone to.
export function selectPacItem(matchText) {
  waitForPacItems()

  if (matchText) {
    const pattern = matchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const matcher = new RegExp(pattern, 'i')

    cy.contains('.pac-item', matcher).trigger('mouseover', { force: true })
    cy.contains('.pac-item', matcher).click({ force: true })
  } else {
    cy.get('.pac-item').first().trigger('mouseover', { force: true })
    cy.get('.pac-item').first().click({ force: true })
  }
}

function fillGeolocationOmnishipping() {
  cy.waitAndGet('#ship-addressQuery', 4000).type('Rua Saint Roman 12')

  selectPacItem('Saint Roman')

  cy.contains('Rua Saint Roman 12')
}

function fillAddressInformation() {
  cy.waitAndGet('#ship-number', 3000).type('12')
}

export function fillPickupLocation({ address }) {
  cy.waitAndGet('#pkpmodal-search input', 3000).type(address)

  // Pick the first prediction (the closest match to the typed address). We
  // don't text-match here: the typed address and the rendered prediction often
  // differ (accents, comma placement), so first-item is more robust than
  // matching for the pickup search box.
  selectPacItem()
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
  // Re-assert visibility immediately before the click so a late shipping
  // recompute re-render (which can detach the button) is re-queried and
  // retried, instead of clicking a stale node and throwing "element detached
  // from the DOM".
  cy.get('.btn-go-to-payment').should('be.visible').click()
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
  chooseDate({ account, shouldActivate }, '#scheduled-delivery-pickup-in-point')
}

export function chooseDate({ account, shouldActivate }, toggleElementId) {
  if (shouldActivateDatePicker({ account, shouldActivate })) {
    cy.waitAndGet(toggleElementId, 1000).click()
  }

  // The datepicker button id is derived from the delivery/pickup point name
  // (e.g. `scheduled-delivery-choose-Retirada-Botafogo (loja-botafogo)`), so it
  // can't be matched by a static `pickup`/`delivery` substring. Instead, scope
  // to the scheduled-delivery group that owns this toggle and click its button.
  cy.get(toggleElementId)
    .closest('.vtex-omnishipping-1-x-scheduledDeliveryList')
    .find('.shp-datepicker-button')
    .should('be.visible')
    .click()

  // Pick the first available day — the `--keyboard-selected` day can be disabled.
  cy.get(
    '.react-datepicker__day:not(.react-datepicker__day--disabled):not(.react-datepicker__day--outside-month)'
  )
    .first()
    .click()
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
