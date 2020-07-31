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

    it('with two valid and one expired cards', () => {
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
        cy.wrap(body)
          .find('.ExpiredSavedCard')
          .should('exist')
        cy.wrap(body)
          .find('.ExpiredSavedCard')
          .should('not.have.class', 'active')
        cy.wrap(body)
          .find('.ExpiredSavedCard')
          .click()
        cy.wrap(body)
          .find('.ExpiredSavedCard')
          .should('not.have.class', 'active')
      })
    })

    it.only('with no valid cards', () => {
      const email = getEmailWithAllExpiredCards()

      setup({ skus: ['289'], account })
      fillEmail(email)
      confirmSecondPurchase()
      selectCreditCardGroup()
      queryIframe($iframe => {
        const body = getIframeBody($iframe)

        cy.wrap(body)
          .find('.ExpiredSavedCard, .SavedCard')
          .should('not.exist')
      })
    })
  })
}
