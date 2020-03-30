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
  payWithCreditCard,
} from '../../../utils/payment-actions'
import { ACCOUNT_NAMES } from '../../../utils/constants'

export default function test(account) {
  describe(`Payment - Credit Card  - Error Finishing Transaction - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: ['289'], account })
      fillEmail(email)
      fillProfile({
        lastName: 'Denied',
      })
      fillShippingInformation(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get('#shipping-data')
          .contains('PAC')
          .should('be.visible')
        cy.get('#shipping-data')
          .contains('Motoboy')
          .should('be.visible')
        cy.get('#shipping-data')
          .contains('Expressa')
          .should('be.visible')
        cy.get('#shipping-data')
          .contains('PAC Lento')
          .should('be.visible')
      } else {
        cy.get('#shipping-data')
          .contains('Mais rápida')
          .should('be.visible')
        cy.get('#shipping-data')
          .contains('Mais econômica')
          .should('be.visible')
      }
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.get('.payment-unauthorized-modal', { timeout: 120000 }).should(
        'be.visible'
      )
      cy.get('.payment-unauthorized-button').click()
      cy.get('.payment-unauthorized-modal').should('not.be.visible')
    })
  })
}
