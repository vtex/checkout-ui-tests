import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  goToShippingPreviewPickup,
  fillShippingPreviewPickupAddress,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup + Delivery - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      setup({ skus: [SKUS.PICKUP_1_SLA, SKUS.DELIVERY_MULTIPLE_SLA], account })

      const selectors = [{ text: 'Pronto em até 2 dias úteis' }]

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
