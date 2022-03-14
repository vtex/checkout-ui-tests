import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS, SLA_IDS } from '../../../utils/constants'

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

      const selectors = []

      fillShippingPreviewDelivery(account)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({ name: 'Expressa' })
      } else {
        selectors.push({ id: SLA_IDS.CHEAPEST })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
