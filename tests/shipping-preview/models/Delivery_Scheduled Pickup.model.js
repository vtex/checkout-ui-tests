import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
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

      const selectors = [{ text: 'Pronto no mesmo dia' }]

      cy.contains('Calcular').should('be.visible')
      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({
          name: 'PAC',
          text: 'Em até 10 dias úteis',
        })
      } else {
        selectors.push({
          name: 'Mais econômica',
          text: 'Em até 10 dias úteis',
        })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
