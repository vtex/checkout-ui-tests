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
  describe(`Delivery - Peru - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.GLOBAL_PRODUCT], salesChannel: 2 })

      fillEmail(email)
      fillProfile()

      selectCountry('PER')

      cy.get('#ship-state').select('Lima')
      cy.get('#ship-city').select('Lima')
      cy.get('#ship-neighborhood').select('Lima___150101')

      cy.get('#ship-street').type('Rua do Limoeiro')
      cy.get('#ship-number').type('0')

      goToPayment()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('PER').should('be.visible')
      cy.contains('Lima, Lima').should('be.visible')
    })
  })
}
