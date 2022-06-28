import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  fillShippingInformation,
} from '../../../utils/shipping-actions'
import { completePurchase, fillGiftCard } from '../../../utils/payment-actions'
import { DELIVERY_TEXT, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Payment - Gift card - Full order value - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('Completing purchase', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.GIFT_CARD], account })
      fillEmail(email)
      fillProfile()
      fillShippingInformation(account)

      goToPayment()

      // In case of consuming the full value
      // you can increase it: https://vtexgame1.myvtex.com/admin/Site/ValeForm.aspx?id=88
      fillGiftCard({ voucher: 'HEPX-FROU-WHLN-TBVD' })

      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
    })
  })
}
