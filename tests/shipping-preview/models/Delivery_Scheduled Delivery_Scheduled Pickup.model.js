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

      /** @type {Array<{ id?: string; name?: string }>} */
      const selectors = [
        { id: SLA_IDS.SCHEDULED_PICKUP },
        { id: SLA_IDS.SCHEDULED },
      ]

      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account, SLA_IDS.SCHEDULED_PICKUP)

      // The delivery item (SKU 31) resolves to a single carrier at this address,
      // so the preview renders the multi-SLA select variant labelled "PAC"
      // (`.srp-delivery-current-many`), which carries no `cheapest`/`fastest`
      // data-testid — assert its visible carrier name instead.
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({
          name: 'Motoboy',
        })
      } else {
        selectors.push({
          name: 'PAC',
        })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
