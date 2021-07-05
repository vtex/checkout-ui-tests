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
  combinePaymentMethods,
  selectSamsungPayGroup,
  fillCreditCardInfo,
  fillFoodVoucherInfo,
} from '../../../utils/payment-actions'
import { PHONES, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Payment - Credit Card and Food Voucher - Finish Purchase - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('Completing purchase using Credit Card and Food Voucher', () => {
      const email = getRandomEmail()
      setup({ skus: [SKUS.RARE_COIN], account })
      fillEmail(email)
      fillProfile({ phone: PHONES.UK, lastName: 'Foo' })
      fillShippingInformation(account)
      goToPayment()
      cy.contains(
        'Adicione até duas opções de pagamento para combiná-las'
      ).should('not.be.visible')
      selectSamsungPayGroup()
      combinePaymentMethods()
      cy.contains('Pagamentos (0)').should('be.visible')
      fillCreditCardInfo()
      cy.contains('Pagamentos (1)').should('be.visible')
      fillFoodVoucherInfo()
      cy.contains('Pagamentos (2)').should('be.visible')
      //   completePurchase()
    })
  })
}
