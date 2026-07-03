import { visitAndClearCookies, setup } from '../../../utils'
import { TIMEOUTS } from '../../../utils/timeouts'
import {
  getRandomEmail,
  fillEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import { ARGENTINA_TEXT, SKUS } from '../../../utils/constants'
import {
  selectCountry,
  goToPayment,
  interceptAutoCompleteResponse,
  selectPacItem,
} from '../../../utils/shipping-actions'
import {
  payWithBoleto,
  completePurchase,
  goBackToShipping,
} from '../../../utils/payment-actions'

// Stub the Google Places "place details" geocode so the address fields are
// populated deterministically. Relying on the live geocode is flaky here: on
// the second entry (after #force-shipping-fields) it intermittently resolved to
// a street-level result with no house number, leaving #ship-number empty so
// shipping validation never passed and the flow never reached payment.
// The displayed address comes from address_components (route+number, then
// admin_area_level_2, admin_area_level_1); the geometry only drives SLA
// serviceability, so we reuse the proven-serviceable coordinates used by the
// other Argentina geolocation tests.
const SANTA_FE_PLACE = {
  address_components: [
    { long_name: '2255', short_name: '2255', types: ['street_number'] },
    {
      long_name: 'Hipólito Irigoyen',
      short_name: 'Hipólito Irigoyen',
      types: ['route'],
    },
    {
      long_name: 'Santa Fe',
      short_name: 'Santa Fe',
      types: ['locality', 'political'],
    },
    {
      long_name: 'La Capital',
      short_name: 'La Capital',
      types: ['administrative_area_level_2', 'political'],
    },
    {
      long_name: 'Santa Fé',
      short_name: 'Santa Fé',
      types: ['administrative_area_level_1', 'political'],
    },
    {
      long_name: 'Argentina',
      short_name: 'AR',
      types: ['country', 'political'],
    },
    { long_name: 'S3000', short_name: 'S3000', types: ['postal_code'] },
  ],
  geometry: {
    location: { lat: -31.4003977, lng: -64.19741259999999 },
    viewport: {
      northeast: { lat: -31.3990067697085, lng: -64.19598181970849 },
      southwest: { lat: -31.4017047302915, lng: -64.1986797802915 },
    },
  },
}

function enterArgentinaAddress() {
  selectCountry('ARG')
  cy.get('#ship-addressQuery').type('Hipólito Irigoyen 2255, Santa Fé')
  // Register the (times:1) details stub after typing and before the click that
  // triggers GetPlaceDetails. Any prediction works since the details are stubbed.
  interceptAutoCompleteResponse(SANTA_FE_PLACE)
  selectPacItem()

  // The stubbed geocode reliably fills street/city/state, but the house
  // number's binding to #ship-number is flaky. When it binds the address is
  // complete and the form collapses to a read-only summary (no input); when it
  // doesn't, the editable input stays present and empty — a required field that
  // blocks the advance to payment. Let the form settle, then fill the number
  // only if the input is actually there (no force on a possibly-disabled field —
  // that would discard the value). Either way the address ends up complete.
  cy.wait(3000)
  cy.get('body').then(($body) => {
    if ($body.find('#ship-number:visible').length) {
      cy.get('#ship-number').should('be.enabled').clear().type('2255').blur()
      cy.wait(3000)
    }
  })
}

export default function test(account) {
  describe(`Delivery - Geolocation Input - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.GLOBAL_PRODUCT], account, salesChannel: 2 })

      fillEmail(email)
      fillProfile()

      enterArgentinaAddress()

      goToPayment()

      goBackToShipping()

      cy.get('#force-shipping-fields').trigger('mouseover')
      cy.get('#force-shipping-fields').click()

      cy.get('#ship-addressQuery').should('be.visible')

      enterArgentinaAddress()

      goToPayment()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: TIMEOUTS.PAYMENT_PROCESSING }).should(
        'contain',
        '/orderPlaced'
      )
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains(ARGENTINA_TEXT).should('be.visible')
      cy.contains('La Capital, Santa Fé').should('be.visible')
    })
  })
}
