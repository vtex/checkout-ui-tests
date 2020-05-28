import { setup, visitAndClearCookies } from '../../../utils'
import { insertCoupon } from '../../../utils/payment-actions'
import {
  checkShippingPreviewResult,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - Same Price Packages - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })

      const selectors = []

      fillShippingPreviewDelivery(account)
      insertCoupon()

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        checkShippingPreviewResult([{ name: 'PAC' }])
      } else {
        selectors.push({ id: SLA_IDS.FASTEST })
        checkShippingPreviewResult(selectors)
      }
    })
  })
}
