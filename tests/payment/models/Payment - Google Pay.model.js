import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  fillShippingInformation,
} from '../../../utils/shipping-actions'
import { selectWHGooglePay } from '../../../utils/payment-actions'
import { SKUS } from '../../../utils/constants'

/**
 * @param {string} account
 */
export default function test(account) {
  describe(`Payment - Google Pay - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it.skip('should render Google Pay button with installment options', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })
      fillEmail(email)
      fillProfile()
      fillShippingInformation(account)

      goToPayment()
      selectWHGooglePay(account)
      cy.waitAndGet('#google-pay-button', 3000).should('be.visible').click()
    })
  })
}
