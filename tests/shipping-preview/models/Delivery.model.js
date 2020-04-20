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

      cy.contains('Calcular').should('be.visible')

      fillShippingPreviewDelivery(account)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        checkShippingPreviewResult([
          { name: 'PAC', text: 'Em até 10 dias úteis' },
        ])

        cy.get('.srp-delivery-select').select('Motoboy')

        checkShippingPreviewResult([
          { name: 'Motoboy', text: 'Em até 7 dias úteis' },
        ])
      } else {
        checkShippingPreviewResult([
          { name: 'Mais econômica', text: 'Em até 10 dias úteis' },
        ])

        cy.get('.srp-delivery-select').select('FASTEST')

        checkShippingPreviewResult([
          { name: 'Mais rápida', text: 'Em até 7 dias úteis' },
        ])
      }
    })
  })
}
