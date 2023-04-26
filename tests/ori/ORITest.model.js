import { setup, visitAndClearCookies } from '../../utils'
import { fillEmail, getRandomEmail } from '../../utils/profile-actions'
import getDocument from '../../utils/document-generator'
import '@testing-library/cypress/add-commands'

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
  let items

  try {
    items = require(`./${account}.data.json`)
  } catch (e) {
    throw new Error(`No test data found for account ${account}`)
  }

  describe.only(`Ori synthetic replay - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })
    const implementedAccounts = {
      fulfillmentqa: {
        code: (item) => {
          if (item.items[0].sku === '2') {
            cy.findAllByText('Adicionar GiftCard: Grátis').click()
            cy.get('.gift-message-add').click()
            cy.waitAndGet('.gift-message-textarea', 3000).type(
              'Testing service'
            )
          }

          cy.get('#shipping-calculate-link').click()
          cy.waitAndGet('#ship-postalCode', 3000).type(item.destinationCEP[0])
        },
      },
      kopenhagen21: {
        code: (item) => {
          const email = getRandomEmail()

          fillEmail(email)
          cy.get('#client-email').should('have.value', '')
          cy.get('#client-email').type(email)
          cy.get('#optin-kopclub').click()
          fillProfile()
          cy.get('#btn-profile-fake').click()
          cy.waitAndGet('#ship-postalCode', 3000).type(item.destinationCEP[0])
        },
      },
      cea: {
        code: (item) => {
          //cy.get('.vtex-front-messages-close-all').click()
          cy.get('#shipping-calculate-link').click()
          cy.waitAndGet('#ship-postalCode', 3000).type(item.destinationCEP[0])
        },
      },
    }

    items.forEach((item) => {
      it(`Replay for items ${item.items.reduce(
        (prev, { sku }) => `${prev} ${sku}`,
        ''
      )}`, () => {
        setup({ skus: item.items, account })

        implementedAccounts[account].code(item)
      })
    })
  })
}
