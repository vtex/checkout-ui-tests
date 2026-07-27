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

      /** @type {Array<{ id?: string; name?: string }>} */
      const selectors = [{ id: SLA_IDS.PICKUP }, { id: SLA_IDS.SCHEDULED }]

      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)

      // How the remaining delivery item can be asserted depends on lean shipping.
      // Lean accounts aggregate its SLAs into a single option that carries the
      // `cheapest` data-testid. Non-lean accounts render the raw multi-SLA select
      // with no such testid — assert the visible carrier name instead.
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({ name: 'Motoboy' })
      } else if (account === ACCOUNT_NAMES.CLEAN_NO_MAPS) {
        selectors.push({ name: 'PAC' })
      } else {
        selectors.push({ id: SLA_IDS.CHEAPEST })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
