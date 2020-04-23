import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Pickup - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled pickup', () => {
      setup({
        skus: [SKUS.DELIVERY_MULTIPLE_SLA, SKUS.SCHEDULED_PICKUP],
        account,
      })

      const selectors = [{ id: SLA_IDS.PICKUP_EN }]

      cy.contains('Calcular').should('be.visible')
      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({
          name: 'PAC',
        })
      } else {
        selectors.push({
          name: 'Mais econômica',
        })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
