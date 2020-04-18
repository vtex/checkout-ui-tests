import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Scheduled Delivery - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('complete purchase with scheduled delivery', () => {
      setup({ skus: [SKUS.SCHEDULED_DELIVERY], account })

      cy.contains('Calcular').should('be.visible')
      fillShippingPreviewDelivery(account)

      cy.contains('Receber').should('be.visible')
    })
  })
}
