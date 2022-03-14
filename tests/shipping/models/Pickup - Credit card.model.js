import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import { fillPickupAddress, goToPayment } from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import {
  goToInvoiceAddress,
  fillInvoiceAddress,
} from '../../../utils/invoice-actions'
import { ACCOUNT_NAMES, PICKUP_TEXT, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.PICKUP_1_SLA], account })
      fillEmail(email)
      fillProfile()
      fillPickupAddress(account)
      goToInvoiceAddress(account)
      fillInvoiceAddress(account)
      goToPayment()
      payWithCreditCard({ withAddress: account !== ACCOUNT_NAMES.INVOICE })
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Cartão de crédito').should('be.visible')
      cy.contains(/final 8936/i).should('be.visible')
      cy.contains(PICKUP_TEXT).should('be.visible')
      cy.contains('Rua General Azevedo Pimentel 5').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
    })
  })
}
