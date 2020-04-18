import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewPickupResult,
  fillShippingPreviewPickupAddress,
} from '../../../utils/shipping-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      setup({ skus: [SKUS.PICKUP_1_SLA], account })

      cy.contains('Calcular').should('be.visible')
      cy.get('#shipping-calculate-link', { force: true }).click()
      
      fillShippingPreviewPickupAddress(account)
      
      checkShippingPreviewPickupResult()
    })
  })
}
