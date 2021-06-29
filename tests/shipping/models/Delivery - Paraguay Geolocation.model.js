import { visitAndClearCookies, setup } from '../../../utils'
import {
  getRandomEmail,
  fillEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import { SKUS } from '../../../utils/constants'
import { selectCountry, goToPayment } from '../../../utils/shipping-actions'
import { payWithBoleto, completePurchase } from '../../../utils/payment-actions'

export default function test(account) {
  describe(`Delivery - Paraguay - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.PARAGUAY_DELIVERY], salesChannel: 2, account })

      fillEmail(email)
      fillProfile()

      selectCountry('PRY')

      cy.get('#ship-addressQuery').type('Avenida Brasilia')

      cy.get('.pac-item')
        .first()
        .trigger('mouseover')

      cy.get('.pac-item')
        .first()
        .click()

      cy.contains('Avenida Brasilia')

      cy.get('#ship-number').type('1189')
      cy.get('#ship-receiverName').type('{selectAll}{backspace}Checkout Team')

      goToPayment()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Paraguay').should('be.visible')
      cy.contains('Asunción - Asunción').should('be.visible')
    })
  })
}
