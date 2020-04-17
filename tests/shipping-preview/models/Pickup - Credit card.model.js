import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  fillShippingPreviewPickupAddress,
} from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import {
  goToInvoiceAddress,
  fillInvoiceAddress,
} from '../../../utils/invoice-actions'
import { ACCOUNT_NAMES, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.PICKUP_1_SLA], account })
      cy.get('#shipping-calculate-link', { force: true }).click()
      fillShippingPreviewPickupAddress(account)
      cy.contains('Retirar').should('be.visible')
      fillEmail(email)
      fillProfile()
      goToInvoiceAddress(account)
      fillInvoiceAddress(account)
      if (account === ACCOUNT_NAMES.INVOICE) {
        goToPayment()
      }
      payWithCreditCard({ withAddress: account !== ACCOUNT_NAMES.INVOICE })
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Cartão de crédito').should('be.visible')
      cy.contains('final 8936').should('be.visible')
      cy.contains('Retirar').should('be.visible')
      cy.contains('Rua General Azevedo Pimentel 5').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
    })
  })
}
