import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewPickupResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup + Scheduled Delivery - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      setup({
        skus: [SKUS.PICKUP_1_SLA, SKUS.SCHEDULED_DELIVERY],
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
