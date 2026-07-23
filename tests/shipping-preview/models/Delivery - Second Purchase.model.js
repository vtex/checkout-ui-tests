import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  confirmSecondPurchase,
  getSecondPurchaseEmail,
} from '../../../utils/profile-actions'
import { checkShippingPreviewResult } from '../../../utils/shipping-actions'
import { goBackToCart } from '../../../utils/summary-actions'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - Second Purchase - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getSecondPurchaseEmail()

      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })

      fillEmail(email)
      confirmSecondPurchase()
      goBackToCart()

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        checkShippingPreviewResult([{ name: 'Motoboy' }])
      } else {
        // On the second purchase the saved address resolves to a single SLA, so the
        // preview renders the `justOneOption` variant (ResultRadio) whose visible
        // text is the delivery estimate — not the lean "Mais econômica" title. Assert
        // that estimate instead of the (never-rendered) "cheapest" label.
        checkShippingPreviewResult([{ name: 'Em até 7 dias úteis' }])
      }
    })
  })
}
