import { visitAndClearCookies, setup } from '../../../utils'
import {
  getRandomEmail,
  fillEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import { SKUS, ACCOUNT_NAMES } from '../../../utils/constants'
import { selectCountry, goToPayment } from '../../../utils/shipping-actions'
import { payWithBoleto, completePurchase } from '../../../utils/payment-actions'

export default function test(account) {
  describe(`Delivery - Argentina - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.GLOBAL_PRODUCT], salesChannel: 2, account })

      fillEmail(email)
      fillProfile()

      selectCountry('ARG')

      if (account === ACCOUNT_NAMES.GEOLOCATION) {
        cy.get('#ship-addressQuery').type(
          'Rioja 3950, Rosario, Santa Fe, Argentina'
        )

        cy.get('.pac-item')
          .first()
          .trigger('mouseover')

        cy.get('.pac-item')
          .first()
          .click()

        cy.get('#force-shipping-fields')
          .first()
          .trigger('mouseover')

        cy.get('#force-shipping-fields')
          .first()
          .click()

        cy.get('#ship-state').contains('Santa Fe')
      } else {
        cy.get('#ship-postalCode').type('2000')

        cy.get('#ship-street').type('Rioja')
        cy.get('#ship-number').type('3950')
      }

      goToPayment()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Argentina').should('be.visible')
      cy.contains('Rosário, Santa Fé').should('be.visible')
    })
  })
}
