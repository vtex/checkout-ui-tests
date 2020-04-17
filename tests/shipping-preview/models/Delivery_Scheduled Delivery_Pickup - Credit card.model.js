import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  chooseDeliveryDate,
  fillShippingInformation,
  fillRemainingInfo,
  fillShippingPreviewPickupAddress,
  goToShippingPreviewPickup,
} from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import { goToInvoiceAddress } from '../../../utils/invoice-actions'
import { SKUS, ACCOUNT_NAMES } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery + Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled delivery and pickup point', () => {
      const email = getRandomEmail()
      setup({
        skus: [
          SKUS.PICKUP_1_SLA,
          SKUS.SCHEDULED_DELIVERY,
          SKUS.DELIVERY_CUSTOMIZATION_ATTACHMENT,
        ],
        account,
      })

      goToShippingPreviewPickup()
      fillShippingPreviewPickupAddress(account)
      if (account === ACCOUNT_NAMES.NO_LEAN) {
        cy.get('.srp-content')
          .contains('PAC')
          .should('be.visible')
      }
      cy.contains('Receber').should('be.visible')
      cy.contains('Retirar').should('be.visible')
      fillEmail(email)
      fillProfile()
      fillRemainingInfo()
      fillShippingInformation(account)
      chooseDeliveryDate({ shouldActivate: true })
      goToInvoiceAddress(account)
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Receber').should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
      cy.contains('Agendada').should('be.visible')
      cy.contains('Retirar').should('be.visible')
    })
  })
}
