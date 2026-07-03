import { setup, visitAndClearCookies } from '../../../utils'
import { TIMEOUTS } from '../../../utils/timeouts'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  fillPickupAddress,
  goToPayment,
  choosePickup,
} from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithCreditCard,
  fillBillingAddress,
} from '../../../utils/payment-actions'
import {
  goToInvoiceAddress,
  fillInvoiceAddress,
} from '../../../utils/invoice-actions'
import { ACCOUNT_NAMES, SKUS, PICKUP_TEXT } from '../../../utils/constants'
import { removeUnavailablePickups } from '../../../utils/items-actions'

export default function test(account) {
  describe(`Pickup + Pickup Unavailable + Unavailable Delivery - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getRandomEmail()

      setup({
        skus: [
          SKUS.PICKUP_RJ,
          SKUS.PICKUP_RJ_BARRA,
          SKUS.DELIVERY_PORTO_ALEGRE,
        ],
        account,
      })
      fillEmail(email)
      fillProfile()
      choosePickup()
      fillPickupAddress(account)
      removeUnavailablePickups()
      goToInvoiceAddress(account)
      fillInvoiceAddress(account)
      goToPayment()
      payWithCreditCard()

      // For pickup-only orders there is no shipping address to prefill the
      // billing address, so it must be entered manually: select the country and
      // fill street/neighborhood/number. INVOICE accounts inherit billing from
      // the invoice address, so they skip this step.
      if (account !== ACCOUNT_NAMES.INVOICE) {
        fillBillingAddress({
          id: 0,
          country: 'Brasil',
          postalCode: '22071060',
          street: 'Rua Saint Roman',
          neighborhood: 'Copacabana',
          number: '12',
        })
      }

      completePurchase()

      cy.url({ timeout: TIMEOUTS.PAYMENT_PROCESSING }).should(
        'contain',
        '/orderPlaced'
      )
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
