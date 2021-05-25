import { setup, visitAndClearCookies } from '../../../utils'
import {
  checkShippingPreviewResult,
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })

      fillShippingPreviewDelivery(account)

      checkShippingPreviewResult(
        account === ACCOUNT_NAMES.NO_LEAN
          ? [{ name: 'PAC' }]
          : [{ name: 'Mais econômica' }]
      )

      cy.get('.srp-delivery-select').select('Em até 7 dias úteis - R$ 10,00')

      checkShippingPreviewResult(
        account === ACCOUNT_NAMES.NO_LEAN
          ? [{ name: 'Motoboy' }]
          : [{ name: 'Mais rápida' }]
      )
    })
  })
}
