import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'
import { SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe.skip(`Scheduled Delivery + Scheduled Pickup - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('scheduled delivery with scheduled pickup', () => {
      setup({
        skus: [SKUS.SCHEDULED_DELIVERY, SKUS.SCHEDULED_PICKUP],
        account,
      })

      const selectors = [
        { id: SLA_IDS.SCHEDULED },
        { id: SLA_IDS.SCHEDULED_PICKUP },
      ]

      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)
      checkShippingPreviewResult(selectors)
    })
  })
}
