import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
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

      const selectors = [
        { text: 'Pronto em até 2 dias úteis' },
        { text: 'A partir de hoje' },
      ]

      cy.contains('Calcular').should('be.visible')
      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)
      checkShippingPreviewResult(selectors)
    })
  })
}
