import { setup, visitAndClearCookies } from '../../../utils'
import {
  choosePickupShippingPreview,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { SKUS, ACCOUNT_NAMES } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery Only + Delivery/Pickup - Boleto - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      setup({
        skus: [
          SKUS.PICKUP_1_SLA_AND_DELIVERY_MULTIPLE_SLA,
          SKUS.DELIVERY_MULTIPLE_SLA_AND_PICKUP_AT_PORTO_ALEGRE,
        ],
        account,
      })

      cy.contains('Calcular').should('be.visible')

      fillShippingPreviewDelivery(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get('.srp-content')
          .contains('PAC')
          .should('be.visible')
      } else {
        cy.waitAndGet('.srp-content', 3000)
          .contains('Mais econômica')
          .should('be.visible')
      }

      choosePickupShippingPreview()
    })
  })
}
