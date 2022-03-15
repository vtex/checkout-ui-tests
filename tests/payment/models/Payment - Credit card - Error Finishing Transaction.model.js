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
  getIframeBody,
  payWithCreditCard,
  queryIframe,
} from '../../../utils/payment-actions'
import { ACCOUNT_NAMES } from '../../../utils/constants'

export default function test(account) {
  describe(`Payment - Credit Card - Error Finishing Transaction - ${account}`, () => {
    beforeEach(() => {
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

      cy.get('.payment-unauthorized-modal', { timeout: 120000 }).should(
        'be.visible'
      )
      cy.get('.payment-unauthorized-button').click()
      cy.get('.payment-unauthorized-modal').should('not.be.visible')
    })

    it('should be able to update billing address after error', () => {
      const email = getRandomEmail()

      setup({ skus: ['289'], account })
      fillEmail(email)
      fillProfile({
        lastName: 'Denied',
      })
      fillShippingInformation(account)
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.get('.payment-unauthorized-modal', { timeout: 120000 }).should(
        'be.visible'
      )
      cy.get('.payment-unauthorized-button').click()
      cy.get('.payment-unauthorized-modal').should('not.be.visible')

      queryIframe(($iframe) => {
        const body = getIframeBody($iframe)

        cy.wrap(body).find(`#address-toggle-0`).click()

        cy.wrap(body).contains('Endereço de cobrança').should('be.visible')
      })
    })

    it('should validate form fields after error', () => {
      const email = getRandomEmail()

      setup({ skus: ['289'], account })
      fillEmail(email)
      fillProfile({
        lastName: 'Denied',
      })
      fillShippingInformation(account)
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.get('.payment-unauthorized-modal', { timeout: 120000 }).should(
        'be.visible'
      )
      cy.get('.payment-unauthorized-button').click()
      cy.get('.payment-unauthorized-modal').should('not.be.visible')

      queryIframe(($iframe) => {
        const body = getIframeBody($iframe)

        cy.wrap(body).find('#creditCardpayment-card-0Code').clear()
      })

      completePurchase()

      queryIframe(($iframe) => {
        const body = getIframeBody($iframe)

        cy.wrap(body).contains('Campo obrigatório').should('be.visible')
      })
    })
  })
}
