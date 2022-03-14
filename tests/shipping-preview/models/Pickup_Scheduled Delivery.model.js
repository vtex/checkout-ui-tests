import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'
import { SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup + Scheduled Delivery - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      setup({
        skus: [SKUS.PICKUP_1_SLA, SKUS.SCHEDULED_DELIVERY],
        account,
      })

      const selectors = [{ id: SLA_IDS.PICKUP }, { id: SLA_IDS.SCHEDULED }]

      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)
      checkShippingPreviewResult(selectors)
    })
  })
}
