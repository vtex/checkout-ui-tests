import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  fillRemainingInfo,
  fillRemainingShippingInfo,
  fillShippingPreviewDelivery,
  choosePickup,
} from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import { goToInvoiceAddress } from '../../../utils/invoice-actions'
import { SKUS, ACCOUNT_NAMES } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery Only + Delivery/Pickup - Boleto - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getRandomEmail()

      setup({
        skus: [
          SKUS.PICKUP_1_SLA_AND_DELIVERY_MULTIPLE_SLA,
          SKUS.DELIVERY_MULTIPLE_SLA_AND_PICKUP_AT_PORTO_ALEGRE,
        ],
        account,
      })
      fillShippingPreviewDelivery(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get('.srp-content')
          .contains('PAC')
          .should('be.visible')
      } else {
        cy.waitAndGet('.srp-content', 3000)
          .contains('Mais econômica')
          .should('be.visible')
      }
      fillEmail(email)
      fillProfile()
      choosePickup()
      cy.get('#shipping-data')
        .contains('Loja em Copacabana no Rio de Janeiro')
        .should('be.visible')
      fillRemainingInfo()
      fillRemainingShippingInfo(account)
      goToInvoiceAddress(account)
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Retirar').should('be.visible')
      cy.contains('Loja em Copacabana no Rio de Janeiro').should('be.visible')
      cy.contains('Rua General Azevedo Pimentel 5').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
      cy.contains('Receber').should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
    })
  })
}
