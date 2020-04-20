import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'
import { SKUS, ACCOUNT_NAMES } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery + Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled delivery and pickup point', () => {
      setup({
        skus: [
          SKUS.PICKUP_1_SLA,
          SKUS.SCHEDULED_DELIVERY,
          SKUS.DELIVERY_CUSTOMIZATION_ATTACHMENT,
        ],
        account,
      })

      const selectors = [
        { text: 'Pronto em até 2 dias úteis' },
        { text: 'A partir de hoje' },
      ]

      cy.contains('Calcular').should('be.visible')
      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({ name: 'PAC', text: 'Em até 8 dias úteis' })
      } else {
        selectors.push({ text: 'Em até 8 dias úteis' })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
