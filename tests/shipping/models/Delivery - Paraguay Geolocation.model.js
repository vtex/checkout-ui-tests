import { visitAndClearCookies, setup } from '../../../utils'
import {
  getRandomEmail,
  fillEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import { SKUS } from '../../../utils/constants'
import {
  selectCountry,
  goToPayment,
  interceptAutoCompleteResponse,
} from '../../../utils/shipping-actions'
import { payWithBoleto, completePurchase } from '../../../utils/payment-actions'

export default function test(account) {
  describe(`Delivery - Paraguay - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.PARAGUAY_DELIVERY], salesChannel: 2, account })

      fillEmail(email)
      fillProfile()

      selectCountry('PRY')

      cy.get('#ship-addressQuery').type('Avenida Brasilia')

      cy.get('.pac-item').first().trigger('mouseover')

      interceptAutoCompleteResponse({
        address_components: [
          {
            long_name: 'Avenida Brasilia',
            short_name: 'Av Brasilia',
            types: ['route'],
          },
          {
            long_name: 'Asunción',
            short_name: 'Asunción',
            types: ['locality', 'political'],
          },
          {
            long_name: 'Asunción',
            short_name: 'Asunción',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'Asunción',
            short_name: 'Asunción',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'Paraguay',
            short_name: 'PY',
            types: ['country', 'political'],
          },
        ],
        geometry: {
          location: {
            lat: -25.2768615,
            lng: -57.5995792,
          },
          viewport: {
            northeast: {
              lat: -25.2755125197085,
              lng: -57.5982302197085,
            },
            southwest: {
              lat: -25.2782104802915,
              lng: -57.60092818029151,
            },
          },
        },
      })

      cy.get('.pac-item').first().click()

      cy.contains('Avenida Brasilia')

      cy.get('#ship-number').type('1189')
      cy.get('#ship-receiverName').type('{selectAll}{backspace}Checkout Team')

      goToPayment()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Paraguay').should('be.visible')
      cy.contains('Asunción - Asunción').should('be.visible')
    })
  })
}
