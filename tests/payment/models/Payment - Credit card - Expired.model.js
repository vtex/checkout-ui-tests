import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getEmailWithSomeExpiredCard,
  confirmSecondPurchase,
  getEmailWithAllExpiredCards,
} from '../../../utils/profile-actions'
import {
  selectCreditCardGroup,
  queryIframe,
  getIframeBody,
} from '../../../utils/payment-actions'

export default function test(account) {
  describe(`Payment - Credit Card  - Expired - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('should not be able to select expired credit card', () => {
      const email = getEmailWithSomeExpiredCard()

      setup({ skus: ['289'], account })
      fillEmail(email)
      confirmSecondPurchase()
      selectCreditCardGroup()
      queryIframe($iframe => {
        const body = getIframeBody($iframe)

        cy.wrap(body)
          .contains('Cartão vencido')
          .should('be.visible')
          .children('input')
          .should('not.be.checked')
        cy.wrap(body)
          .contains('Cartão vencido')
          .click()
        cy.wrap(body)
          .contains('Cartão vencido')
          .children('input')
          .should('not.be.checked')
      })
    })

    it('with no valid cards', () => {
      const email = getEmailWithAllExpiredCards()

      setup({ skus: ['289'], account })
      fillEmail(email)
      confirmSecondPurchase()
      selectCreditCardGroup()
      queryIframe($iframe => {
        const body = getIframeBody($iframe)

        cy.wrap(body)
          .contains('Cartão vencido')
          .should('not.exist')
      })
    })
  })
}
