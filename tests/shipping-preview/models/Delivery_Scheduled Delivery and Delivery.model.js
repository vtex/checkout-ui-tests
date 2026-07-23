import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery and Delivery - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('one item with delivery and another item with both scheduled delivery and delivery', () => {
      setup({
        skus: [
          SKUS.DELIVERY_AND_PICKUP,
          SKUS.SCHEDULED_DELIVERY_AND_DELIVERY_MULTIPLE_SLA,
        ],
        account,
      })

      /** @type {Array<{ id?: string; name?: string }>} */
      const selectors = []

      fillShippingPreviewDelivery(account)

      // At this address the delivery item resolves to a single carrier, so the
      // preview renders the multi-SLA select variant labelled "Expressa"
      // (`.srp-delivery-current-many`), which carries no `cheapest` data-testid —
      // assert its visible carrier name instead, for lean accounts too.
      selectors.push({ name: 'Expressa' })

      checkShippingPreviewResult(selectors)
    })
  })
}
