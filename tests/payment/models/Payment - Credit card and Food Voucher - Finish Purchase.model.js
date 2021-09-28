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
  selectSamsungPay,
  fillCreditCardInfo,
  fillFoodVoucherInfo,
} from '../../../utils/payment-actions'
import { SKUS, CREDIT_CARD } from '../../../utils/constants'

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
      selectSamsungPay()
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

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Cartão de crédito').should('be.visible')
      cy.contains(`${CREDIT_CARD.FINAL}`).should('be.visible')
    })
  })
}
