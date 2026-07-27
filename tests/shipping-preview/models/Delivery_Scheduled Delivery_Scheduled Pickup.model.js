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

      // How the delivery item (SKU 31) can be asserted depends on lean shipping.
      // Lean accounts aggregate its SLAs into a single option that carries the
      // `cheapest` data-testid. Non-lean accounts render the raw multi-SLA select
      // (`.srp-delivery-current-many`), which has no such testid — assert the
      // visible carrier name instead.
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({
          name: 'Motoboy',
        })
      } else if (account === ACCOUNT_NAMES.CLEAN_NO_MAPS) {
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
