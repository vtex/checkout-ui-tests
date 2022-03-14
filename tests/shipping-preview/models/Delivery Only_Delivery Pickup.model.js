import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  choosePickupShippingPreview,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS, SLA_IDS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery Only + Delivery/Pickup - ${account}`, () => {
    beforeEach(() => {
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

      fillShippingPreviewDelivery(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        selectors.push({ name: 'PAC' })
      } else {
        selectors.push({ name: 'Mais econômica' })
      }

      checkShippingPreviewResult(selectors)
      choosePickupShippingPreview()

      selectors.push({
        id: SLA_IDS.MULTIPLE_PICKUP,
      })

      checkShippingPreviewResult(selectors)
    })
  })
}
