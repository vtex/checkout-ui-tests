import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  selectCountry,
  interceptAutoCompleteResponse,
} from '../../../utils/shipping-actions'
import {
  completePurchase,
  fillBillingAddress,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import { SKUS, DELIVERY_TEXT } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - No zipcode - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.POLYGON_ARGENTINA], account })

      fillEmail(email)
      fillProfile()

      selectCountry('ARG')

      cy.waitAndGet('#ship-addressQuery', 3000).type(
        'Corrientes 240, Las Varillas, Córdoba, Argentina'
      )

      cy.get('.pac-item').first().trigger('mouseover')

      interceptAutoCompleteResponse({
        address_components: [
          {
            long_name: '240',
            short_name: '240',
            types: ['street_number'],
          },
          {
            long_name: 'Corrientes',
            short_name: 'Corrientess',
            types: ['route'],
          },
          {
            long_name: 'Las Varillas',
            short_name: 'Las Varillas',
            types: ['locality', 'political'],
          },
          {
            long_name: 'San Justo',
            short_name: 'San Justo',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'Córdoba',
            short_name: 'Córdoba',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'Argentina',
            short_name: 'AR',
            types: ['country', 'political'],
          },
        ],
        geometry: {
          location: {
            lat: -31.86611169999999,
            lng: -62.71555590000001,
          },
          viewport: {
            northeast: {
              lat: -31.8647362197085,
              lng: -62.71417041970849,
            },
            southwest: {
              lat: -31.86743418029149,
              lng: -62.71686838029151,
            },
          },
        },
      })

      cy.get('.pac-item').first().click()

      cy.contains('Corrientes 240')
      cy.contains('San Justo, Córdoba')

      goToPayment()
      payWithCreditCard()

      fillBillingAddress({
        id: 0,
        postalCode: '5940',
        number: '240',
        street: 'Corrientes',
        city: 'Córdoba',
      })

      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Cartão de crédito').should('be.visible')
      cy.contains(/final 8936/i).should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      cy.contains('Corrientes 240').should('be.visible')
      cy.contains('San Justo').should('be.visible')
    })
  })
}
