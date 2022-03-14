import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import { payWithBoleto, completePurchase } from '../../../utils/payment-actions'
import { shouldAssertGiftRegistry, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Gift List - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('gift list with delivery', () => {
      const email = getRandomEmail()

      setup({
        mobile: false,
        isGiftList: true,
        skus: [SKUS.DELIVERY_CUSTOMIZATION_ATTACHMENT],
        account,
      })
      fillEmail(email)
      fillProfile()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')

      if (shouldAssertGiftRegistry) {
        cy.contains('Teste Endereço').should('be.visible')
      }
    })
  })
}
