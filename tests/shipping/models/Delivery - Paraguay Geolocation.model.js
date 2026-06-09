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
  selectPacItem,
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

      // The selected prediction's details are stubbed below, so any item works;
      // register the stub first, then click via the robust pac-item helper.
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

      selectPacItem()

      cy.contains('Avenida Brasilia')

      // Committing the number triggers a shipping recompute that transiently
      // disables the sibling fields; blur it and let the recompute fully settle
      // before touching the receiver-name field (otherwise it re-disables
      // mid-type), then settle again before advancing.
      cy.get('#ship-number').type('1189').blur()
      cy.wait(3000)
      cy.get('#ship-receiverName')
        .should('be.enabled')
        .type('{selectAll}{backspace}Checkout Team')
        .blur()
      cy.wait(3000)

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
