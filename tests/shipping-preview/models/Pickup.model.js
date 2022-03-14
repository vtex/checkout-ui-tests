import { setup, visitAndClearCookies } from '../../../utils'
import {
  calculateShippingPreview,
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
} from '../../../utils/shipping-actions'
import { SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      setup({ skus: [SKUS.PICKUP_1_SLA], account })

      const selectors = [{ id: SLA_IDS.PICKUP }]

      calculateShippingPreview()
      fillShippingPreviewPickupAddress(account)
      checkShippingPreviewResult(selectors)
    })
  })
}
