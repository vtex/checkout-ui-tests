import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery + Pickup - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled delivery and pickup point', () => {
      setup({
        skus: [
          SKUS.PICKUP_1_SLA,
          SKUS.SCHEDULED_DELIVERY,
          SKUS.DELIVERY_CUSTOMIZATION_ATTACHMENT,
        ],
        account,
      })

      const selectors = [{ id: SLA_IDS.PICKUP }, { id: SLA_IDS.SCHEDULED }]

      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({ name: 'PAC' })
      } else {
        selectors.push({ id: SLA_IDS.CHEAPEST })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
