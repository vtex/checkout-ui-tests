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
} from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery and Delivery - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('one item with delivery and another item with both scheduled delivery and delivery', () => {
      const email = getRandomEmail()

      setup({
        skus: [
          SKUS.DELIVERY_AND_PICKUP,
          SKUS.SCHEDULED_DELIVERY_AND_DELIVERY_MULTIPLE_SLA,
        ],
        account,
      })

      fillEmail(email)
      fillProfile()
      fillShippingInformation(account)
      chooseDeliveryDate({ account, shouldActivate: true })
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
    })
  })
}
