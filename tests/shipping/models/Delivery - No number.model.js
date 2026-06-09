import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import { goToPayment, selectPacItem } from '../../../utils/shipping-actions'
import { completePurchase, payWithBoleto } from '../../../utils/payment-actions'
import { SKUS, DELIVERY_TEXT } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - Address with no number - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.GLOBAL_PRODUCT], account })
      fillEmail(email)
      fillProfile()

      cy.waitAndGet('#ship-addressQuery', 3000).type('Rua Saint Roman')

      selectPacItem('Saint Roman')

      cy.contains('Rua Saint Roman')

      cy.get('.box-step > .btn').click()

      cy.contains('Campo obrigatório.')

      // Committing the number triggers a shipping recompute (shippingData POST)
      // that re-renders and transiently detaches the go-to-payment button; blur
      // to fire it now and let it settle before advancing (mirrors the Peru
      // delivery model).
      cy.get('#ship-number').type(12).blur()
      cy.wait(3000)

      goToPayment()

      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
    })
  })
}
