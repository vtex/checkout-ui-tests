import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import { goToPayment } from '../../../utils/shipping-actions'
import { completePurchase, payWithBoleto } from '../../../utils/payment-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - Credit Card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.GLOBAL_PRODUCT], account })
      fillEmail(email)
      fillProfile()

      cy.waitAndGet('#ship-addressQuery', 3000).type('Rua Saint Roman')

      cy.get('.pac-item')
        .first()
        .trigger('mouseover')

      cy.get('.pac-item')
        .first()
        .click()

      cy.contains('Rua Saint Roman')

      goToPayment()

      cy.contains('Este campo é obrigatório.')

      cy.get('#ship-number').type(12)

      goToPayment()

      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Receber').should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
      cy.contains('PAC').should('be.visible')
    })
  })
}
