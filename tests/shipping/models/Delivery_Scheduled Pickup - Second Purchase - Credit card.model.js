import { setup, visitAndClearCookies } from '../../../utils'
import {
  confirmSecondPurchase,
  fillEmail,
  getSecondPurchaseEmail,
  login,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  choosePickupDate,
  fillRemainingInfo,
  unavailableDeliveryGoToPickup,
} from '../../../utils/shipping-actions'
import { completePurchase, typeCVV } from '../../../utils/payment-actions'
import { goToInvoiceAddress } from '../../../utils/invoice-actions'
import {
  ACCOUNT_NAMES,
  SKUS,
  DELIVERY_TEXT,
  PICKUP_TEXT,
  SCHEDULED_TEXT,
} from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Pickup - 2P - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled pickup', () => {
      const email = getSecondPurchaseEmail()

      setup({
        skus: [SKUS.DELIVERY_MULTIPLE_SLA, SKUS.SCHEDULED_PICKUP],
        account,
      })

      fillEmail(email)
      confirmSecondPurchase()
      unavailableDeliveryGoToPickup()
      choosePickupDate({ account })
      fillRemainingInfo()
      goToInvoiceAddress(account)
      login(account)
      goToInvoiceAddress(account)
      goToPayment()
      typeCVV()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains(PICKUP_TEXT).should('be.visible')
      cy.contains('Loja em Copacabana no Rio de Janeiro').should('be.visible')
      cy.contains('Rua General Azevedo Pimentel 5').should('be.visible')
      cy.contains(SCHEDULED_TEXT).should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      if (account === ACCOUNT_NAMES.INVOICE) {
        cy.contains('Rua Saint Roman 12').should('be.visible')
      } else {
        cy.contains('Rua*** ***man ***').should('be.visible')
      }

      cy.contains('PAC').should('be.visible')
    })
  })
}
