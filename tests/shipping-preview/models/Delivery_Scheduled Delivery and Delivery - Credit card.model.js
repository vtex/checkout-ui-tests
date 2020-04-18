import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery and Delivery - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('one item with delivery and another item with both scheduled delivery and delivery', () => {
      setup({
        skus: [
          SKUS.DELIVERY_AND_PICKUP,
          SKUS.SCHEDULED_DELIVERY_AND_DELIVERY_MULTIPLE_SLA,
        ],
        account,
      })

      cy.contains('Calcular').should('be.visible')
      fillShippingPreviewDelivery(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get('.srp-content')
          .contains('Expressa')
          .should('be.visible')
      }
      cy.contains('Receber').should('be.visible')
    })
  })
}
