import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewPickupResult,
  goToShippingPreviewPickup,
  fillShippingPreviewPickupAddress,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup + Delivery - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      setup({ skus: [SKUS.PICKUP_1_SLA, SKUS.DELIVERY_MULTIPLE_SLA], account })
      
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
      checkShippingPreviewPickupResult()
    })
  })
}
