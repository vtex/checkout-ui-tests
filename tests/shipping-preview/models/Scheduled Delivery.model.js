import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe.skip(`Scheduled Delivery - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('complete purchase with scheduled delivery', () => {
      setup({ skus: [SKUS.SCHEDULED_DELIVERY], account })

      const selectors = [{ id: SLA_IDS.SCHEDULED }]

      fillShippingPreviewDelivery(account)
      checkShippingPreviewResult(selectors)
    })
  })
}
