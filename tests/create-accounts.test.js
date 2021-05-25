import { visitAndClearCookies, setup } from '../utils'
import { SKUS } from '../utils/constants'
import { fillEmail, confirmSecondPurchase } from '../utils/profile-actions'

function getAuthCode(accountNumber) {
  return cy.request(`http://localhost:8080/login-code/${accountNumber}`)
}

const account = 'vtexgame1invoice'

const BASE_USER_NUM = 30

for (let i = BASE_USER_NUM; i <= 110; i++) {
  describe(`Auth ${i}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('should create user account', () => {
      const email = `second-purchase-${i}@mailinator.com`
      setup({ skus: [SKUS.DELIVERY_MULTIPLE_SLA], account })

      fillEmail(email)

      confirmSecondPurchase()

      cy.wait(3000)

      cy.get('#client-profile-data a.link-box-edit').click()

      cy.wait(3000)

      cy.get('#loginWithUserAndPasswordBtn').click()

      cy.get('.dead-link')
        .contains('Esqueci minha senha')
        .click()

      cy.get('#inputNewPassword').type('Abcd1234')
      cy.get('#inputConfirmNewPassword').type('Abcd1234')

      cy.get('#tryChangePswdBtn').click()

      cy.wait(3000)

      getAuthCode(i).then(response => {
        const { code } = response.body

        cy.get('#access-code').type(code)

        cy.intercept('/api/vtexid/pub/authentication/classic/setpassword').as(
          'setpassword'
        )

        cy.get('#changePswdBtn').click()

        cy.wait('@setpassword')
      })
    })
  })
}
