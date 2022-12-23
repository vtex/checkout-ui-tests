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
  invalidateInvoiceAddress,
} from '../../../utils/invoice-actions'
import { ACCOUNT_NAMES, PICKUP_TEXT, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup Invoice Address - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('should proceed with valid address only', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.PICKUP_1_SLA], account })
      fillEmail(email)
      fillProfile()
      fillPickupAddress(account)
      goToInvoiceAddress(account)
      fillInvoiceAddress(account)

      invalidateInvoiceAddress(account)

      cy.get('#ship-number').type('12')

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

    it('should invalidate go to payment button even after user inserted correct address once', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.PICKUP_1_SLA], account })
      fillEmail(email)
      fillProfile()
      fillPickupAddress(account)
      goToInvoiceAddress(account)
      fillInvoiceAddress(account)
      goToPayment()

      cy.get('#edit-shipping-data').click()

      invalidateInvoiceAddress(account)

      cy.get('#ship-number').type('12')

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

    it('should invalidate not allow invalid postal codes', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.PICKUP_1_SLA], account })
      fillEmail(email)
      fillProfile()
      fillPickupAddress(account)
      goToInvoiceAddress(account)
      fillInvoiceAddress(account)
      goToPayment()

      cy.get('#edit-shipping-data').click()

      cy.waitAndGet('#ship-postalCode', 1000)
        .last()
        .clear()
        .type('invalid postal code')
        .blur()
      cy.get('.ship-postalCode .error')
        .should('exist')
        .contains('CEP inválido.')

      cy.get('#btn-go-to-payment').should('not.exist')

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
