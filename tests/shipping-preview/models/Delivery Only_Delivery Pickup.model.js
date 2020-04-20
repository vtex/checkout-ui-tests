import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  choosePickupShippingPreview,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { SKUS, ACCOUNT_NAMES } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery Only + Delivery/Pickup - Boleto - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      setup({
        skus: [
          SKUS.PICKUP_1_SLA_AND_DELIVERY_MULTIPLE_SLA,
          SKUS.DELIVERY_MULTIPLE_SLA_AND_PICKUP_AT_PORTO_ALEGRE,
        ],
        account,
      })

      const selectors = []

      cy.contains('Calcular').should('be.visible')

      fillShippingPreviewDelivery(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({ name: 'PAC', text: 'Em até 10 dias úteis' })
      } else {
        selectors.push({ name: 'Mais econômica', text: 'Em até 10 dias úteis' })
      }

      checkShippingPreviewResult(selectors)
      choosePickupShippingPreview()

      selectors.push({ text: 'Pronto em até 11 dias' })

      checkShippingPreviewResult(selectors)
    })
  })
}
