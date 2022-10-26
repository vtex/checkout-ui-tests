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
  confirmRedirect,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import { ACCOUNT_NAMES, DELIVERY_TEXT } from '../../../utils/constants'

export default function test(account) {
  describe(`Payment - Credit Card - Redirect - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it.skip('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: ['289'], account })
      fillEmail(email)
      fillProfile({
        lastName: 'Redirect',
      })
      fillShippingInformation(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get('#shipping-data').contains('PAC').should('be.visible')
        cy.get('#shipping-data').contains('Motoboy').should('be.visible')
        cy.get('#shipping-data').contains('Expressa').should('be.visible')
        cy.get('#shipping-data').contains('PAC Lento').should('be.visible')
      } else {
        cy.get('#shipping-data').contains('Mais rápida').should('be.visible')
        cy.get('#shipping-data').contains('Mais econômica').should('be.visible')
      }

      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', 'vtexpayments.com.br')

      confirmRedirect()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Redirect').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Cartão de crédito').should('be.visible')
      cy.contains(/final 8936/i).should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
      cy.contains('PAC').should('be.visible')
    })
  })
}
