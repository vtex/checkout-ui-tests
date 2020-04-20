import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
} from '../../../utils/shipping-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      setup({ skus: [SKUS.PICKUP_1_SLA], account })

      const selectors = [{ text: 'Pronto em até 2 dias úteis' }]
      cy.contains('Calcular').should('be.visible')
      cy.get('#shipping-calculate-link', { force: true }).click()

      fillShippingPreviewPickupAddress(account)

      checkShippingPreviewResult(selectors)
    })
  })
}
