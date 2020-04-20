import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { SKUS, ACCOUNT_NAMES } from '../../../utils/constants'

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

      const selectors = [{ text: 'A partir de hoje' }]

      cy.contains('Calcular').should('be.visible')
      fillShippingPreviewDelivery(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({ name: 'Expressa', text: 'Em até 2 dias úteis' })
      } else {
        selectors.push({ text: 'Em até 2 dias úteis' })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
