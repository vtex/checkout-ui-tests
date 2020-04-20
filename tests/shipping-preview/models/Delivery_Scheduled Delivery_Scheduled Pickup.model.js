import { setup, visitAndClearCookies } from '../../../utils'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'
import {
  checkShippingPreviewResult,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery + Scheduled Pickup - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled delivery and scheduled pickup', () => {
      setup({
        skus: [
          SKUS.DELIVERY_CUSTOMIZATION_ATTACHMENT,
          SKUS.SCHEDULED_DELIVERY,
          SKUS.SCHEDULED_PICKUP,
        ],
        account,
      })

      const selectors = [
        { text: 'Pronto no mesmo dia' },
        { text: 'A partir de hoje' },
      ]

      cy.contains('Calcular').should('be.visible')
      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({
          name: 'PAC',
          text: 'Em até 8 dias úteis',
        })
      } else {
        selectors.push({
          text: 'Em até 8 dias úteis',
        })
      }

      checkShippingPreviewResult(selectors)
    })
  })
}
