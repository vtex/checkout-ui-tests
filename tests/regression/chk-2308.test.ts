import { visitAndClearCookies, setup } from '../../utils'
import { Accounts, SKUs } from '../../utils/constants'
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
} from '../../utils/profile-actions'

describe('CHK-2308', () => {
  describe(`${Accounts.DEFAULT}`, () => {
    beforeEach(() => {
      visitAndClearCookies(Accounts.DEFAULT)
    })

    it('should show the selected address when click in edit address', async () => {
      const email = getSecondPurchaseEmail()

      setup({
        skus: [SKUs.GLOBAL_PRODUCT],
        salesChannel: '2',
        account: Accounts.DEFAULT,
      })

      fillEmail(email)
      confirmSecondPurchase()

      cy.wait(1000)

      cy.waitAndGet('#edit-address-button', 1000).first().click()

      cy.get('#loginWithUserAndPasswordBtn').click()
      cy.get('#inputPassword').type('Abcd1234')
      cy.waitAndGet('#classicLoginBtn', 1000).click()

      cy.wait(3000)

      cy.get('#back-to-address-list').first().click()

      cy.waitAndGet('#new-address-button', 1000).first().click()

      cy.waitAndGet('#back-to-address-list', 1000).first().click()

      cy.wait(1000)

      cy.get(
        '.vtex-omnishipping-1-x-addressItemOption.vtex-omnishipping-1-x-active .postalCode'
      ).then(($field) => {
        const postalCode = $field.text()

        cy.waitAndGet('#edit-address-button', 1000).first().click()

        cy.wait(1000)

        cy.get('#ship-postalCode').should('have.value', postalCode)
        cy.get('.vtex-omnishipping-1-x-addressSummaryActive').should(
          'be.visible'
        )
      })
    })
  })
})
