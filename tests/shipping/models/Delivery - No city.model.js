import { visitAndClearCookies, setup } from '../../../utils'
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
} from '../../../utils/shipping-actions'
import { payWithBoleto, completePurchase } from '../../../utils/payment-actions'

export default function test(account) {
  describe(`Delivery - No city - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.GLOBAL_PRODUCT], salesChannel: 2, account })

      fillEmail(email)
      fillProfile()

      selectCountry('ARG')

      cy.get('#ship-addressQuery').type('Castro Barros 523, Córdoba, Argentina')

      cy.get('.pac-item').first().trigger('mouseover')

      interceptAutoCompleteResponse({
        address_components: [
          {
            long_name: '523',
            short_name: '523',
            types: ['street_number'],
          },
          {
            long_name: 'Avenida Castro Barros',
            short_name: 'Av. Castro Barros',
            types: ['route'],
          },
          {
            long_name: 'X5000HTF',
            short_name: 'X5000HTF',
            types: ['locality', 'political'],
          },
          {
            long_name: 'City Does Not Exist',
            short_name: 'City',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'State Does Not Exist',
            short_name: 'State',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'Argentina',
            short_name: 'AR',
            types: ['country', 'political'],
          },
          {
            long_name: 'X5000',
            short_name: 'X5000',
            types: ['postal_code'],
          },
        ],
        geometry: {
          location: {
            lat: -31.4003977,
            lng: -64.19741259999999,
          },
          viewport: {
            northeast: {
              lat: -31.3990067697085,
              lng: -64.19598181970849,
            },
            southwest: {
              lat: -31.4017047302915,
              lng: -64.1986797802915,
            },
          },
        },
      })

      cy.get('.pac-item').first().click()

      cy.contains('Avenida Castro Barros 523')

      cy.contains('City Does Not Exist, State Does Not Exist')

      goToPayment()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains(ARGENTINA_TEXT).should('be.visible')
      cy.contains('City Does Not Exist, State Does Not Exist').should(
        'be.visible'
      )
    })
  })
}
