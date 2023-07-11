import { setup, visitAndClearCookies } from '../../../utils'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'
import {
  goToInvoiceAddress,
  fillInvoiceAddress,
} from '../../../utils/invoice-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import {
  fillPickupAddress,
  goToPayment,
  interceptAutoCompleteResponse,
} from '../../../utils/shipping-actions'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'

export default function test(account) {
  describe(`Pickup - Invoice no Zipcode - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.PICKUP_1_SLA], account })

      fillEmail(email)
      fillProfile()

      fillPickupAddress(account)
      goToInvoiceAddress(account)

      interceptAutoCompleteResponse({
        // intentionally omit postal code to verify the component still works
        // as expected
        address_components: [
          {
            long_name: 'Rua Saint Roman',
            short_name: 'R. Saint Roman',
            types: ['route'],
          },
          {
            long_name: 'Copacabana',
            short_name: 'Copacabana',
            types: ['sublocality_level_1', 'sublocality', 'political'],
          },
          {
            long_name: 'Rio de Janeiro',
            short_name: 'Rio de Janeiro',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'Rio de Janeiro',
            short_name: 'RJ',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'Brasil',
            short_name: 'BR',
            types: ['country', 'political'],
          },
        ],
        geometry: {
          location: {
            lat: -22.9810425,
            lng: -43.1940799,
          },
        },
      })

      fillInvoiceAddress(account)
      goToPayment()
      payWithCreditCard({ withAddress: account !== ACCOUNT_NAMES.INVOICE })
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
    })
  })
}
