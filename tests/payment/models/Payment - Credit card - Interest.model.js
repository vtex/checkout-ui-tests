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
  fillCreditCardAndSelectInstallmentWithInterest,
} from '../../../utils/payment-actions'

export default function test(account) {
  describe(`Payment - Credit Card - Interest - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('should show interest value on purchase summary', () => {
      const email = getRandomEmail()

      setup({ skus: ['289'], account })
      fillEmail(email)
      fillProfile()
      fillShippingInformation(account)
      goToPayment()
      fillCreditCardAndSelectInstallmentWithInterest()
      cy.wait(2000)
      cy.get('.orderform-template .totalizers-list .interest').should(
        'be.visible'
      )

      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains('Juros').should('be.visible')
    })
  })
}
