import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled delivery with multiple items', () => {
      setup({
        skus: [SKUS.DELIVERY_AND_PICKUP, SKUS.SCHEDULED_DELIVERY],
        account,
      })

      const selectors = [{ id: SLA_IDS.SCHEDULED }]

      cy.contains('Calcular').should('be.visible')
      fillShippingPreviewDelivery(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({ name: 'Expressa' })
      } else {
        selectors.push({ id: SLA_IDS.CHEAPEST })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
