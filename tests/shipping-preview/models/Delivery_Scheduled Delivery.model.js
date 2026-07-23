import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled delivery with multiple items', () => {
      setup({
        skus: [SKUS.DELIVERY_AND_PICKUP, SKUS.SCHEDULED_DELIVERY],
        account,
      })

      /** @type {Array<{ id?: string; name?: string }>} */
      const selectors = [{ id: SLA_IDS.SCHEDULED }]

      fillShippingPreviewDelivery(account)
      // At this address the delivery item resolves to a single carrier, so the
      // preview renders the multi-SLA select variant labelled "Expressa"
      // (`.srp-delivery-current-many`), which carries no `fastest` data-testid —
      // assert its visible carrier name instead, for lean accounts too.
      selectors.push({ name: 'Expressa' })

      checkShippingPreviewResult(selectors)
    })
  })
}
