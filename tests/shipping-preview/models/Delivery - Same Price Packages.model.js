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

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        checkShippingPreviewResult([{ name: 'PAC' }])
      } else {
        checkShippingPreviewResult([{ id: SLA_IDS.FASTEST }])
      }
    })
  })
}
