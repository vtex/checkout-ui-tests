import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  fillPickupAddress,
  goToPayment,
  choosePickup,
  fillRemainingInfo,
  fillShippingInformation,
  selectOtherPickup,
} from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import {
  goToInvoiceAddress,
  fillInvoiceAddress,
} from '../../../utils/invoice-actions'
import { PICKUP_TEXT, SKUS } from '../../../utils/constants'
import { removeUnavailablePickups } from '../../../utils/items-actions'

export default function test(account) {
  describe(`Pickup + Pickup Unavailable + Delivery - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getRandomEmail()

      setup({
        skus: [
          SKUS.PICKUP_RJ,
          SKUS.PICKUP_RJ_BARRA,
          SKUS.DELIVERY_MULTIPLE_SLA,
        ],
        account,
      })
      fillEmail(email)
      fillProfile()
      choosePickup()
      fillPickupAddress(account)
      selectOtherPickup()
      removeUnavailablePickups()
      fillRemainingInfo()
      fillShippingInformation(account)
      goToInvoiceAddress(account)
      fillInvoiceAddress(account)
      goToPayment()
      payWithCreditCard({ withAddress: false })
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Cartão de crédito').should('be.visible')
      cy.contains(/final 8936/i).should('be.visible')
      cy.contains(PICKUP_TEXT).should('be.visible')
      cy.contains('Rua Marquês de Abrantes 5').should('be.visible')
      cy.contains('Flamengo').should('be.visible')
      cy.contains('Delivery').should('be.visible')
      cy.contains('Rua Saint Roman, 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
    })
  })
}
