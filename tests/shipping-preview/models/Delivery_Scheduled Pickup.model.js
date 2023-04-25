import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Pickup - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled pickup', () => {
      setup({
        skus: [SKUS.DELIVERY_MULTIPLE_SLA, SKUS.SCHEDULED_PICKUP],
        account,
      })

      const selectors = [{ id: SLA_IDS.SCHEDULED_PICKUP }]

      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account, SLA_IDS.SCHEDULED_PICKUP)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({
          name: 'PAC',
        })
      } else {
        selectors.push({
          name: 'Mais econômica',
        })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
