import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'
import { SKUS, ACCOUNT_NAMES } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled pickup', () => {
      setup({
        skus: [SKUS.DELIVERY_MULTIPLE_SLA, SKUS.SCHEDULED_PICKUP],
        account,
      })

      cy.contains('Calcular').should('be.visible')
      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get('.srp-content')
          .contains('PAC')
          .should('be.visible')
      } else {
        cy.waitAndGet('.srp-content', 3000)
          .contains('Mais econômica')
          .should('be.visible')
      }
      cy.contains('Retirar').should('be.visible')
      cy.contains('Loja em Copacabana no Rio de Janeiro')
        .should('be.visible')
    })
  })
}
