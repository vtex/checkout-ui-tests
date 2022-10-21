import { Accounts, SKUs } from '../../utils/constants'
import {
  getRandomEmail,
  getSecondPurchaseEmail,
} from '../../utils/profile-actions'
import { interceptAutoCompleteResponse } from '../../utils/shipping-actions'

describe('CHK-1904', () => {
  describe(`${Accounts.NO_LEAN}`, () => {
    beforeEach(() => {
      cy.createCartThenVisit(Accounts.NO_LEAN, [SKUs.DELIVERY_NORTHEAST])
    })

    it('should not revert the selected SLA', () => {
      cy.fillEmail(getRandomEmail())
      cy.fillProfile()

      cy.fillPostalCode('22250040')

      cy.get('#shipping-data').findByDisplayValue('PAC').should('be.checked')

      cy.intercept(
        {
          method: 'POST',
          url: '/api/checkout/pub/orderForm/**/shippingData',
          times: 1,
        },
        (req) => {
          req.reply((res) => {
            console.log(res.body)
            res.body.shippingData.logisticsInfo[0].slas[0].deliveryIds[0].dockId =
              'another-dock'

            res.send()
          })
        }
      ).as('modifiedShippingRequest')

      cy.get('#shipping-data')
        .findByDisplayValue('Expressa')
        .as('expressSLA')
        .click({ force: true })

      cy.wait('@modifiedShippingRequest')

      cy.get('@expressSLA').should('be.checked')
    })
  })

  describe(`${Accounts.GEOLOCATION_NO_LEAN}`, () => {
    beforeEach(() => {
      cy.createCartThenVisit(Accounts.GEOLOCATION_NO_LEAN, [
        SKUs.DELIVERY_NORTHEAST,
      ])
    })

    it('should not show unavailable message', () => {
      cy.fillEmail(getSecondPurchaseEmail())
      cy.findByText('Continuar com a compra').click()

      cy.intercept(
        {
          url: '/api/checkout/**/paymentData',
        },
        (req) => {
          req.destroy()
        }
      ).as('paymentDataRequest')

      cy.intercept({
        url: '/api/checkout/**/shippingData',
        times: 1,
      }).as('shippingDataRequest')

      cy.get('#open-shipping').click()

      cy.hash().should('eq', '#/shipping')

      cy.wait('@shippingDataRequest')

      cy.findByText(/entregar em outro endereço/i).click()

      cy.findByLabelText('Endereço').type('praia de botafogo 300')

      interceptAutoCompleteResponse({
        address_components: [
          {
            long_name: '300',
            short_name: '300',
            types: ['street_number'],
          },
          {
            long_name: 'Praia de Botafogo',
            short_name: 'Praia de Botafogo',
            types: ['route'],
          },
          {
            long_name: 'Botafogo',
            short_name: 'Botafogo',
            types: ['sublocality_level_1', 'sublocality', 'political'],
          },
          {
            long_name: 'Rio de Janeiro',
            short_name: 'Rio de Janeiro',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'Rio de Janeiro',
            short_name: 'RJ',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'Brasil',
            short_name: 'BR',
            types: ['country', 'political'],
          },
        ],
        geometry: {
          location: {
            lat: -22.9443311,
            lng: -43.1825559,
          },
          viewport: {
            northeast: {
              lat: -22.9431687197085,
              lng: -43.18106091970849,
            },
            southwest: {
              lat: -22.9458666802915,
              lng: -43.18375888029149,
            },
          },
        },
      })

      cy.get('.pac-item').first().trigger('mouseover')

      cy.intercept({
        url: '/api/checkout/**/shippingData',
        times: 1,
      }).as('shippingDataRequest')

      cy.get('.pac-item').first().click()

      cy.wait('@googleMapsAutocomplete')

      cy.wait('@shippingDataRequest')

      cy.findByText(/a entrega não é possível no endereço inserido/i).should(
        'not.exist'
      )
    })
  })
})
