import { visitAndClearCookies, setup } from '../../../utils'
import {
  getRandomEmail,
  fillEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import { SKUS } from '../../../utils/constants'
import { selectCountry, goToPayment } from '../../../utils/shipping-actions'
import {
  payWithBoleto,
  completePurchase,
  goBackToShipping,
} from '../../../utils/payment-actions'

export default function test(account) {
  describe(`Delivery - Geolocation Input - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.DELIVERY_ARGENTINA], account })

      fillEmail(email)
      fillProfile()

      selectCountry('ARG')

      cy.get('#ship-addressQuery').type('Santa Fe')

      cy.get('.pac-item')
        .eq(2)
        .trigger('mouseover')

      cy.get('.pac-item')
        .eq(2)
        .click()

      cy.get('#ship-receiverName').type('{selectAll}{backspace}Checkout Team')

      cy.contains('Santa Fe')

      goToPayment()

      goBackToShipping()

      cy.get('#force-shipping-fields').click()

      cy.contains('#ship-addressQuery')

      cy.get('#ship-addressQuery').type('Guatemala')

      cy.get('.pac-item')
        .first()
        .trigger('mouseover')

      cy.get('.pac-item')
        .first()
        .click()

      goToPayment()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Peru').should('be.visible')
      cy.contains('Lima, Lima').should('be.visible')
    })
  })
}
