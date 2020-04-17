import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  chooseDeliveryDate,
  fillRemainingShippingInfo,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import { SKUS, ACCOUNT_NAMES } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled delivery with multiple items', () => {
      const email = getRandomEmail()

      setup({
        skus: [SKUS.DELIVERY_AND_PICKUP, SKUS.SCHEDULED_DELIVERY],
        account,
      })

      fillShippingPreviewDelivery(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get('.srp-content')
          .contains('Expressa')
          .should('be.visible')
      }
      cy.contains('Receber').should('be.visible')
      fillEmail(email)
      fillProfile()
      fillRemainingShippingInfo(account)
      chooseDeliveryDate({ account })
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Receber').should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
      cy.contains('Agendada').should('be.visible')
    })
  })
}
