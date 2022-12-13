import { setup, visitAndClearCookies } from '../../utils'
import { fillEmail, getRandomEmail } from '../../utils/profile-actions'
import getDocument from '../../utils/document-generator'

const items = require('./ORITest.data.json')

const PROFILE_DATA = {
  BRA: {
    document: getDocument(),
    phone: '21999999999',
  },
}

function fillProfile(
  options = {
    firstName: 'Fernando',
    lastName: 'Coelho',
    country: 'BRA',
  }
) {
  const { firstName = 'Fernando', lastName = 'Coelho' } = options

  const data = PROFILE_DATA.BRA

  cy.get('#client-first-name').type(firstName, { force: true })

  cy.get('#client-last-name').type(lastName, { force: true })

  cy.get('#client-document').type(data.document, { force: true })

  cy.get('#client-phone').type(data.phone, { force: true })

  cy.intercept(
    'POST',
    '/api/checkout/pub/orderForm/*/attachments/clientProfileData'
  ).as('updateClientProfileData')
  cy.intercept(
    'POST',
    '/api/checkout/pub/orderForm/*/attachments/clientPreferencesData'
  ).as('updateClientPreferencesData')

  // cy.get('#go-to-shipping').click()

  // cy.wait('@updateClientProfileData')
  // cy.wait('@updateClientPreferencesData')
}

export default function test(account) {
  describe(`Ori synthetic replay - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    items.forEach((item) => {
      it(`Replay for items ${item.items.reduce(
        (prev, { sku }) => `${prev} ${sku}`,
        ''
      )}`, () => {
        const email = getRandomEmail()

        setup({ skus: item.items, account })
        fillEmail(email)
        cy.get('#client-email').should('have.value', '')
        cy.get('#client-email').type(email)
        cy.get('#optin-kopclub').click()
        fillProfile()
        cy.get('#btn-profile-fake').click()
        cy.waitAndGet('#ship-postalCode', 3000).type(item.destinationCEP[0])
      })

      // if (account === ACCOUNT_NAMES.NO_LEAN) {
      //   cy.get('#shipping-data').contains('PAC').should('be.visible')
      //   cy.get('#shipping-data').contains('Motoboy').should('be.visible')
      //   cy.get('#shipping-data').contains('Expressa').should('be.visible')
      //   cy.get('#shipping-data').contains('PAC Lento').should('be.visible')
      // } else {
      //   cy.get('#shipping-data').contains('Mais rápida').should('be.visible')
      //   cy.get('#shipping-data').contains('Mais econômica').should('be.visible')
      // }
    })
  })
}
