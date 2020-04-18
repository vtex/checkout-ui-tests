import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillShippingPreviewDelivery,
} from '../../../utils/shipping-actions'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - Credit Card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })
      
      cy.contains('Calcular').should('be.visible')
      
      fillShippingPreviewDelivery(account)

      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get('.srp-content')
          .contains('PAC')
          .should('be.visible')
      } else {
        cy.waitAndGet('.srp-content', 3000)
          .contains('Mais econômica')
          .should('be.visible')
      }
    })
  })
}
