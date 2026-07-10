import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })

      fillShippingPreviewDelivery(account)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        checkShippingPreviewResult([{ name: 'Motoboy' }])

        cy.get('.srp-delivery-select').select('Motoboy')

        checkShippingPreviewResult([{ name: 'Motoboy' }])
      } else {
        checkShippingPreviewResult([{ name: 'cheapest' }])

        cy.get('.srp-delivery-select').select('CHEAPEST')

        checkShippingPreviewResult([{ name: 'Em até 7 dias úteis' }])
      }
    })
  })
}
