import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Scheduled Delivery + Scheduled Pickup - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('scheduled delivery with scheduled pickup', () => {
      setup({
        skus: [SKUS.SCHEDULED_DELIVERY, SKUS.SCHEDULED_PICKUP],
        account,
      })

      const selectors = [
        { text: 'A partir de hoje' },
        { text: 'Pronto no mesmo dia' },
      ]

      cy.contains('Calcular').should('be.visible')
      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)
      checkShippingPreviewResult(selectors)
    })
  })
}
