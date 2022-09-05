import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  chooseFirstPickupPoint,
  choosePickup,
  fillPickupPostalCode,
} from '../../../utils/shipping-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup Change Address - Boleto - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.PICKUP_1_SLA_AND_DELIVERY_MULTIPLE_SLA], account })
      fillEmail(email)
      fillProfile()

      choosePickup()

      cy.get('#find-pickups-manualy-button-denied').click()

      fillPickupPostalCode({ postalCode: '22250040' })

      chooseFirstPickupPoint()

      cy.get('.vtex-omnishipping-1-x-PickupPointName').should(
        'have.text',
        'Loja no Flamengo do Rio de Janeiro'
      )

      cy.get('#change-pickup-button').click()

      cy.get('.vtex-pickup-points-modal-3-x-locationReset').click()

      fillPickupPostalCode({ postalCode: '{selectAll}{backspace}22071060' })

      chooseFirstPickupPoint()

      cy.get('.vtex-omnishipping-1-x-PickupPointName').should(
        'have.text',
        'Loja em Copacabana no Rio de Janeiro'
      )
    })
  })
}
