import { setup, visitAndClearCookies } from '../../../utils'
import { TIMEOUTS } from '../../../utils/timeouts'
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
import { PICKUP_TEXT_ES, SKUS } from '../../../utils/constants'

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

      // Selecting the neighborhood asynchronously re-renders the pickup points
      // list; wait for it to populate before choosing so `.first()` doesn't click
      // a stale/empty entry.
      cy.get('.pkpmodal-points-list .pkpmodal-pickup-point-main').should(
        'be.visible'
      )

      chooseFirstPickupPoint()

      // Confirm the pickup point actually committed before advancing. Without
      // this gate the order can be placed before the pickup SLA is persisted and
      // the orderPlaced page renders without PICKUP_TEXT ('Retirar').
      cy.get('.vtex-omnishipping-1-x-PickupPointName').should('be.visible')

      goToPayment()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: TIMEOUTS.PAYMENT_PROCESSING }).should(
        'contain',
        '/orderPlaced'
      )
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5112345678').should('be.visible')
      cy.contains('Boleto').should('be.visible')
      // Peru order → orderPlaced renders in Spanish, so the pickup label is
      // "Recogida" (PICKUP_TEXT_ES), not the Brazilian-Portuguese "Retirar".
      cy.contains(PICKUP_TEXT_ES).should('be.visible')
      cy.contains('Loja Peruana').should('be.visible')
      cy.contains('Avenida Paseo de la República S/N').should('be.visible')
      cy.contains('Lima').should('be.visible')
    })
  })
}
