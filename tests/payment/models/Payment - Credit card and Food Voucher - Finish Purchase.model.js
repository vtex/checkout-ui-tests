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
import {
  completePurchase,
  combinePaymentMethods,
  selectPayPalGroup,
  fillCreditCardInfo,
  fillFoodVoucherInfo,
  validateOrderPlaced,
} from '../../../utils/payment-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Payment - Credit Card and Food Voucher - Finish Purchase - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('Completing purchase using Credit Card and Food Voucher', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.CC_FOOD_VOUCHER], account })
      fillEmail(email)
      fillProfile()
      fillShippingInformation(account)
      goToPayment()
      selectPayPalGroup()
      combinePaymentMethods()
      cy.contains(
        'Adicione até duas opções de pagamento para combiná-las'
      ).should('be.visible')
      cy.contains('Pagamentos (0)').should('be.visible')
      fillCreditCardInfo()
      cy.contains('Pagamentos (1)').should('be.visible')
      fillFoodVoucherInfo()
      cy.contains('Pagamentos (2)').should('be.visible')
      completePurchase()

      validateOrderPlaced(email)
    })
  })
}
