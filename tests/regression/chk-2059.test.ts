import {
  fillShippingPreviewDelivery,
  postShippingData,
} from '../../utils/shipping-actions'
import { Accounts, SKUs } from '../../utils/constants'

describe('CHK-2059', () => {
  describe(`${Accounts.DEFAULT}`, () => {
    beforeEach(() => {
      cy.createCartThenVisit(Accounts.DEFAULT, [
        SKUs.PICKUP_1_SLA_DELIVERY_1_SLA,
      ])
    })

    it('should get the active shipping tab from the orderForm after a page reload', () => {
      fillShippingPreviewDelivery()

      const shippingData = {
        logisticsInfo: [
          {
            addressId: '1671632630241',
            itemIndex: 0,
            selectedDeliveryChannel: 'pickup-in-point',
            selectedSla: 'retirada na loja (141125d)',
          },
        ],
        clearAddressIfPostalCodeNotFound: false,
        selectedAddresses: [
          {
            addressId: '1671632630241',
            addressType: 'residential',
            city: 'Rio de Janeiro',
            complement: null,
            country: 'BRA',
            geoCoordinates: [-43.18218231201172, -22.94549560546875],
            neighborhood: 'Botafogo',
            number: null,
            postalCode: '22250-040',
            receiverName: null,
            reference: null,
            state: 'RJ',
            street: 'Praia Botafogo',
            isDisposable: null,
          },
        ],
      }

      cy.getCookie('checkout.vtex.com').then((cookie) => {
        const [, orderFormId] = cookie?.value?.split('=') as [string, string]

        postShippingData({
          account: Accounts.DEFAULT,
          shippingData,
          orderFormId,
        })
      })

      cy.reload()

      cy.contains(
        'Retirar 1 item em Loja em Copacabana no Rio de Janeiro'
      ).should('be.visible')

      cy.get('.srp-toggle__delivery').click()
      cy.contains('Receber 1 item em 22250-040').should('be.visible')

      cy.getCookie('checkout.vtex.com').then((cookie) => {
        const [, orderFormId] = cookie?.value?.split('=') as [string, string]

        postShippingData({
          account: Accounts.DEFAULT,
          shippingData,
          orderFormId,
        })
      })

      cy.reload()
      cy.contains(
        'Retirar 1 item em Loja em Copacabana no Rio de Janeiro'
      ).should('be.visible')
    })
  })
})
