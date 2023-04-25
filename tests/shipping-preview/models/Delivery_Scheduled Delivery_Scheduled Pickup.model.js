import { setup, visitAndClearCookies } from '../../../utils'
import { ACCOUNT_NAMES, SKUS, SLA_IDS } from '../../../utils/constants'
import {
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery + Scheduled Pickup - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled delivery and scheduled pickup', () => {
      setup({
        skus: [
          SKUS.DELIVERY_CUSTOMIZATION_ATTACHMENT,
          SKUS.SCHEDULED_DELIVERY,
          SKUS.SCHEDULED_PICKUP,
        ],
        account,
      })

      const selectors = [
        { id: SLA_IDS.SCHEDULED_PICKUP },
        { id: SLA_IDS.SCHEDULED },
      ]

      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account, SLA_IDS.SCHEDULED_PICKUP)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({
          name: 'PAC',
        })
      } else {
        selectors.push({
          id: SLA_IDS.CHEAPEST,
        })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
