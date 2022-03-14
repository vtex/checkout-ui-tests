import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  goToShippingPreviewPickup,
  fillShippingPreviewPickupAddress,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup + Delivery - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      setup({ skus: [SKUS.PICKUP_1_SLA, SKUS.DELIVERY_MULTIPLE_SLA], account })

      const selectors = [{ id: SLA_IDS.PICKUP }]

      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)

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
