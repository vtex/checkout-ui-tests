import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewPickupResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Scheduled Delivery + Scheduled Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('scheduled delivery with scheduled pickup', () => {
      setup({
        skus: [SKUS.SCHEDULED_DELIVERY, SKUS.SCHEDULED_PICKUP],
        account,
      })

      cy.contains('Calcular').should('be.visible')
      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)
      cy.contains('Receber').should('be.visible')
      checkShippingPreviewPickupResult()
    })
  })
}
