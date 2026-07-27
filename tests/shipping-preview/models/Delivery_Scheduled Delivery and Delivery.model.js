import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'

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

      // Neither variant emits a `cheapest`/`fastest` data-testid, so assert the
      // visible label. It differs by account: on NO_LEAN and CLEAN_NO_MAPS the
      // two items resolve to a single carrier, rendering the multi-SLA select
      // labelled "Expressa". On the lean accounts they aggregate into one option
      // spanning two packages, so `SelectSelectedOption` swaps the carrier name
      // for the `differentTerms` message.
      if (
        account === ACCOUNT_NAMES.NO_LEAN ||
        account === ACCOUNT_NAMES.CLEAN_NO_MAPS
      ) {
        selectors.push({ name: 'Expressa' })
      } else {
        selectors.push({ name: 'Prazos variados' })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
