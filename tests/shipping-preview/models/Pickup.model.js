import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
} from '../../../utils/shipping-actions'
import { SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      setup({ skus: [SKUS.PICKUP_1_SLA], account })

      const selectors = [{ id: SLA_IDS.PICKUP }]
      cy.contains('Calcular').should('be.visible')
      cy.get('#shipping-calculate-link', { force: true }).click()

      fillShippingPreviewPickupAddress(account)

      checkShippingPreviewResult(selectors)
    })
  })
}
