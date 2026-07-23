import { setup, visitAndClearCookies } from '../../../utils'
import { insertFreeShippingCoupon } from '../../../utils/payment-actions'
import {
  checkShippingPreviewResult,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - Same Price Packages - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })

      fillShippingPreviewDelivery(account)
      insertFreeShippingCoupon()

      // vtexgame1clean (CLEAN_NO_MAPS) renders the legacy carrier dropdown for
      // this delivery item rather than the lean "cheapest" radio, so it emits no
      // cheapest/fastest data-testid. Assert its visible carrier name, like
      // no-lean.
      if (
        account === ACCOUNT_NAMES.NO_LEAN ||
        account === ACCOUNT_NAMES.CLEAN_NO_MAPS
      ) {
        checkShippingPreviewResult([{ name: 'Motoboy' }])
      } else {
        checkShippingPreviewResult([{ id: SLA_IDS.CHEAPEST }])
      }
    })
  })
}
