import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  fillPostalCodeOmnishipping,
  choosePickup,
} from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import { SKUS, PICKUP_TEXT } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup - Address with no number - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getRandomEmail()

      setup({
        skus: [SKUS.GLOBAL_PRODUCT],
        account,
      })
      fillEmail(email)
      fillProfile()
      fillPostalCodeOmnishipping()
      choosePickup()
      cy.get('#shipping-data')
        .contains('Loja em Copacabana no Rio de Janeiro')
        .should('be.visible')
      goToPayment()
      payWithCreditCard({ withAddress: true })
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains(PICKUP_TEXT).should('be.visible')
      cy.contains('Loja em Copacabana no Rio de Janeiro').should('be.visible')
      cy.contains('Rua General Azevedo Pimentel 5').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
    })
  })
}
