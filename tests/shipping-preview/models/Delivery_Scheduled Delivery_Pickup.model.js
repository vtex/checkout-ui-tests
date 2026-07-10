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

      // The remaining delivery item resolves to a single carrier, so the preview
      // renders its visible carrier name rather than a `cheapest` data-testid.
      // The label differs from the NO_LEAN view: lean accounts render "PAC".
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({ name: 'Motoboy' })
      } else {
        selectors.push({ name: 'PAC' })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
