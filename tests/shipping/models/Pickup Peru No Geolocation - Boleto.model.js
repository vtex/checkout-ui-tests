import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  chooseFirstPickupPoint,
  goToPayment,
} from '../../../utils/shipping-actions'
import { completePurchase, payWithBoleto } from '../../../utils/payment-actions'
import { PICKUP_TEXT, SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup Peru No Geolocation - Boleto - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.PICKUP_1_SLA], account, salesChannel: '3' })

      fillEmail(email)
      fillProfile({ country: 'PER' })

      cy.get('#find-pickups-manualy-button-denied').click()

      cy.get('#ship-state').select('Lima').should('have.value', 'Lima')
      cy.get('#ship-city').select('Lima').should('have.value', 'Lima')
      cy.get('#ship-neighborhood').select('Lima')

      chooseFirstPickupPoint()

      goToPayment()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5112345678').should('be.visible')
      cy.contains('Boleto').should('be.visible')
      cy.contains(PICKUP_TEXT).should('be.visible')
      cy.contains('Loja Peruana').should('be.visible')
      cy.contains('Avenida Paseo de la República S/N').should('be.visible')
      cy.contains('Lima').should('be.visible')
    })
  })
}
