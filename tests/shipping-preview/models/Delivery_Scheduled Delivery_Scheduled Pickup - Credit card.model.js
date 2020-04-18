import { setup, visitAndClearCookies } from '../../../utils'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'
import {
  checkShippingPreviewPickupResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery + Scheduled Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled delivery and scheduled pickup', () => {
      setup({
        skus: [
          SKUS.DELIVERY_CUSTOMIZATION_ATTACHMENT,
          SKUS.SCHEDULED_DELIVERY,
          SKUS.SCHEDULED_PICKUP,
        ],
        account,
      })

      cy.contains('Calcular').should('be.visible')
      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get('.srp-content')
          .contains('PAC')
          .should('be.visible')
      }
      cy.contains('Receber').should('be.visible')
      checkShippingPreviewPickupResult()
    })
  })
}
