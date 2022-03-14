import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
} from '../../../utils/profile-actions'
import { completePurchase, payWithBoleto } from '../../../utils/payment-actions'
import { DELIVERY_TEXT, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - 2P - Boleto - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('delivery with second purchase email', () => {
      const email = getSecondPurchaseEmail()

      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })
      fillEmail(email)
      confirmSecondPurchase()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      cy.contains('Boleto').should('be.visible')
      cy.contains('PAC').should('be.visible')
    })
  })
}
