import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
  login,
} from '../../../utils/profile-actions'
import { completePurchase, typeCVV } from '../../../utils/payment-actions'
import { goToPayment } from '../../../utils/shipping-actions'
import { goToInvoiceAddress } from '../../../utils/invoice-actions'
import { SKUS, PICKUP_TEXT } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup - 2P - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('start with delivery then, choosing pickup, then choosing pickup', () => {
      const email = getSecondPurchaseEmail()

      setup({ skus: [SKUS.PICKUP_1_SLA], account })
      fillEmail(email)
      confirmSecondPurchase()
      goToInvoiceAddress(account)
      login(account)
      goToInvoiceAddress(account)
      goToPayment()
      typeCVV()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Loja em Copacabana no Rio de Janeiro').should('be.visible')
      cy.contains(PICKUP_TEXT).should('be.visible')
    })
  })
}
