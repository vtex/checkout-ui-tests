import { visitAndClearCookies, setup } from '../../utils'
import { Accounts, SKUs } from '../../utils/constants'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../utils/profile-actions'
import { selectCountry } from '../../utils/shipping-actions'

describe('CHK-1969', () => {
  describe(`${Accounts.GEOLOCATION}`, () => {
    beforeEach(() => {
      visitAndClearCookies(Accounts.GEOLOCATION)
    })

    it('should not show the "Calculate Shipping" for address completed with geolocation for France address', () => {
      const email = getRandomEmail()

      setup({
        skus: [SKUs.GLOBAL_PRODUCT],
        salesChannel: '2',
        account: Accounts.GEOLOCATION,
      })

      fillEmail(email)
      fillProfile()

      selectCountry('FRA')

      cy.waitAndGet('#ship-addressQuery', 3000).type('42000 Saint-Étienne')

      cy.get('.pac-item').first().trigger('mouseover')

      cy.get('.pac-item').first().click()

      cy.wait(2000)

      cy.get('.vtex-omnishipping-1-x-btnDelivery').should('not.exist')
    })
  })
})
