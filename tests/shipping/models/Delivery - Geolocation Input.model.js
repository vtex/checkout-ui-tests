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

      setup({ skus: [SKUS.GLOBAL_PRODUCT], account, salesChannel: 2 })

      fillEmail(email)
      fillProfile()

      selectCountry('ARG')

      cy.get('#ship-addressQuery').type('Hipolito Yrigoyen 2255, Santa Fé')

      cy.get('.pac-item')
        .first()
        .trigger('mouseover')

      cy.get('.pac-item')
        .first()
        .click()

      cy.contains('Hipólito Yrigoyen 2255')

      goToPayment()

      goBackToShipping()

      cy.get('#force-shipping-fields').trigger('mouseover')
      cy.get('#force-shipping-fields').click()

      cy.get('#ship-addressQuery').should('be.visible')

      selectCountry('ARG')

      cy.get('#ship-addressQuery').type('Hipolito Yrigoyen 2255, Santa Fé')

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
      cy.contains('Argentina').should('be.visible')
      cy.contains('La Capital, Santa Fé').should('be.visible')
    })
  })
}
