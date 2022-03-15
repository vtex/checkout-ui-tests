import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  unavailableDeliveryGoToPickup,
  fillRemainingInfo,
  fillShippingInformation,
  fillPickupAddress,
} from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import { goToInvoiceAddress } from '../../../utils/invoice-actions'
import {
  ACCOUNT_NAMES,
  SKUS,
  DELIVERY_TEXT,
  PICKUP_TEXT,
} from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup + Delivery - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.PICKUP_1_SLA, SKUS.DELIVERY_MULTIPLE_SLA], account })
      fillEmail(email)
      fillProfile()
      unavailableDeliveryGoToPickup()
      fillPickupAddress(account)
      fillRemainingInfo()
      fillShippingInformation(account)
      goToInvoiceAddress(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get('#shipping-data').contains('PAC').should('be.visible')
        cy.get('#shipping-data').contains('Motoboy').should('be.visible')
        cy.get('#shipping-data').contains('Expressa').should('be.visible')
        cy.get('#shipping-data').contains('PAC Lento').should('be.visible')
      } else {
        cy.get('#shipping-data').contains('Mais rápida').should('be.visible')
        cy.get('#shipping-data').contains('Mais econômica').should('be.visible')
      }

      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains(PICKUP_TEXT).should('be.visible')
      cy.contains('Loja em Copacabana no Rio de Janeiro').should('be.visible')
      cy.contains('Rua General Azevedo Pimentel 5').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
    })
  })
}
