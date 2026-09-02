import { Accounts, SKUs } from '../../utils/constants'
import { getRandomEmail } from '../../utils/profile-actions'

describe('PEXP-1709', () => {
  describe(`${Accounts.NO_LEAN}`, () => {
    beforeEach(() => {
      cy.createCartThenVisit(Accounts.NO_LEAN, [
        SKUs.DELIVERY_SAME_DAY_ECONOMICAL,
        SKUs.DELIVERY_STANDARD_MULTI_SLA_A,
        SKUs.DELIVERY_STANDARD_MULTI_SLA_B,
      ])
    })

    it('should keep the grouped delivery options after a page reload when only the last two items share identical SLAs', () => {
      cy.fillEmail(getRandomEmail())
      cy.fillProfile()
      cy.fillPostalCode('29900010')

      cy.get('#delivery-packages-options').should('be.visible')
      cy.get('#delivery-packages-options').contains('Economica Mesmo Dia')

      cy.reload()

      cy.get('#delivery-packages-options').should('be.visible')
      cy.get('#delivery-packages-options').contains('Economica Mesmo Dia')
    })
  })
})
