import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
} from '../../../utils/profile-actions'
import { completePurchase, typeCVV } from '../../../utils/payment-actions'
import {
  chooseDeliveryDate,
  goToPayment,
} from '../../../utils/shipping-actions'
import { SKUS, DELIVERY_TEXT } from '../../../utils/constants'

export default function test(account) {
  describe(`Scheduled Delivery - 2P - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('start with delivery then, choosing pickup, then choosing delivery', () => {
      const email = getSecondPurchaseEmail()

      setup({ skus: [SKUS.SCHEDULED_DELIVERY], account })
      fillEmail(email)
      confirmSecondPurchase()
      chooseDeliveryDate({ account })
      goToPayment()
      typeCVV()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      cy.contains('Cop***').should('be.visible')
    })
  })
}
