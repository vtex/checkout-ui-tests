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
        // At this address the lean options aggregate to a single SLA (cheapest ===
        // fastest), so the preview renders the `justOneOption` variant (ResultRadio),
        // which shows the delivery estimate and has no `.srp-delivery-select`
        // dropdown. Assert that estimate; there is no lean option to select.
        checkShippingPreviewResult([{ name: 'Em até 7 dias úteis' }])
      }
    })
  })
}
