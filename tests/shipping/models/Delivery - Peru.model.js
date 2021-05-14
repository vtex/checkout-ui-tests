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
  describe(`Delivery - Peru - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.GLOBAL_PRODUCT], salesChannel: 2, account })

      fillEmail(email)
      fillProfile()

      selectCountry('PER')

      if (account === ACCOUNT_NAMES.GEOLOCATION) {
        cy.waitAndGet('#ship-addressQuery', 3000).type('Av. Javier Prado Este')

        cy.get('.pac-item')
          .first()
          .trigger('mouseover')

        cy.get('.pac-item')
          .first()
          .click()

        cy.contains('Avenida Javier Prado Este')
        cy.get('#ship-number').type('2465')
      } else {
        cy.get('#ship-state').select('Lima')
        cy.get('#ship-city').select('Lima')
        cy.get('#ship-neighborhood').select('San Borja___150130')

        cy.get('#ship-street').type('Avenida Javier Prado Este')
        cy.get('#ship-number').type('2465')
      }

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
