import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
} from '../../../utils/profile-actions'
import { completePurchase, typeCVV } from '../../../utils/payment-actions'
import { SKUS, DELIVERY_TEXT } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - 2P - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('delivery with second purchase email', () => {
      const email = getSecondPurchaseEmail()

      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })
      fillEmail(email)
      confirmSecondPurchase()
      typeCVV()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      cy.contains('PAC').should('be.visible')
    })
  })
}
