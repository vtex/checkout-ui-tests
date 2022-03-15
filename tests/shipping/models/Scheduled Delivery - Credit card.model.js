import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import {
  goToPayment,
  chooseDeliveryDate,
  fillShippingInformation,
} from '../../../utils/shipping-actions'
import { SKUS, DELIVERY_TEXT, SCHEDULED_TEXT } from '../../../utils/constants'

export default function test(account) {
  describe(`Scheduled Delivery - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('complete purchase with scheduled delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.SCHEDULED_DELIVERY], account })
      fillEmail(email)
      fillProfile()

      fillShippingInformation(account)
      chooseDeliveryDate({ account })

      cy.get('#shipping-data').contains('agendada').should('be.visible')
      cy.get('#shipping-data').contains('agendada-top').should('be.visible')

      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
      cy.contains(SCHEDULED_TEXT).should('be.visible')
    })
  })
}
