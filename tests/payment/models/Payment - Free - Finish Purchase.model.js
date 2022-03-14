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
import { completePurchase } from '../../../utils/payment-actions'
import { DELIVERY_TEXT } from '../../../utils/constants'

export default function test(account) {
  describe(`Payment - Free - Finish Purchase - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('Completing purchase for free', () => {
      const email = getRandomEmail()

      setup({ skus: ['23'], account })
      fillEmail(email)
      fillProfile()
      fillShippingInformation(account)

      goToPayment()
      cy.contains(
        'O total da sua compra é grátis. Finalize a compra e obrigado!'
      ).should('be.visible')

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
