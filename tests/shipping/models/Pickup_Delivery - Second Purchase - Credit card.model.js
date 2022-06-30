import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
  login,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  unavailableDeliveryGoToPickup,
  fillRemainingInfo,
} from '../../../utils/shipping-actions'
import { completePurchase, typeCVV } from '../../../utils/payment-actions'
import { goToInvoiceAddress } from '../../../utils/invoice-actions'
import {
  ACCOUNT_NAMES,
  SKUS,
  DELIVERY_TEXT,
  PICKUP_TEXT,
} from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup + Delivery - 2P - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getSecondPurchaseEmail()

      setup({ skus: [SKUS.PICKUP_1_SLA, SKUS.DELIVERY_MULTIPLE_SLA], account })
      fillEmail(email)
      confirmSecondPurchase()
      unavailableDeliveryGoToPickup()

      cy.get('#shipping-data')
        .contains('Loja em Copacabana no Rio de Janeiro')
        .should('be.visible')

      fillRemainingInfo()
      goToInvoiceAddress(account)
      login(account)
      goToInvoiceAddress(account)

      if (account === ACCOUNT_NAMES.INVOICE) {
        cy.get('#shipping-data')
          .contains('Rua Saint Roman 12')
          .should('be.visible')
        cy.get('#shipping-data')
          .contains('Copacabana - Rio de Janeiro - RJ')
          .should('be.visible')
        cy.get('#shipping-data').contains('22071-060').should('be.visible')
      } else {
        cy.get('#shipping-data')
          .contains('Rua*** ***man ***')
          .should('be.visible')
        cy.get('#shipping-data')
          .contains('Cop*** - Rio*** *** - RJ')
          .should('be.visible')
        cy.get('#shipping-data').contains('***60').should('be.visible')
      }

      goToPayment()
      typeCVV()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains(PICKUP_TEXT).should('be.visible')
      cy.contains('Loja em Copacabana no Rio de Janeiro').should('be.visible')
      cy.contains('Rua General Azevedo Pimentel 5').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      if (account === ACCOUNT_NAMES.INVOICE) {
        cy.contains('Rua Saint Roman 12').should('be.visible')
      } else {
        cy.contains('Rua*** ***man ***').should('be.visible')
      }
    })
  })
}
