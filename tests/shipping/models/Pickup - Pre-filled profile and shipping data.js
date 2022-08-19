import { setup, visitAndClearCookies } from '../../../utils'
import { getRandomEmail, postProfileData } from '../../../utils/profile-actions'
import { postShippingData } from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithBoleto,
  visitPayment,
} from '../../../utils/payment-actions'
import { SKUS, PICKUP_TEXT } from '../../../utils/constants'

export default function test(account) {
  describe(`Pickup - Pre-filled profile and shipping data - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only pickup', () => {
      const email = getRandomEmail()

      const profileData = {
        email,
        firstName: 'Paulo',
        lastName: 'Pipoco',
        document: '12345678909',
        phone: '2144443333',
      }

      const shippingData = {
        logisticsInfo: [
          {
            addressId: '1',
            itemIndex: 0,
            selectedDeliveryChannel: 'pickup-in-point',
            selectedSla: 'retirada na loja (141125d)',
          },
        ],
        selectedAddresses: [
          {
            addressId: '1',
            addressType: 'search',
            country: 'BRA',
            postalCode: '22250-040',
          },
        ],
      }

      setup({
        skus: [SKUS.PICKUP_1_SLA_DELIVERY_1_SLA],
        account,
      })

      cy.getCookie('checkout.vtex.com').then((cookie) => {
        const [, orderFormId] = cookie.value.split('=')

        postProfileData({ account, profileData, orderFormId })
        postShippingData({ account, shippingData, orderFormId })
        visitPayment({ account, orderFormId })
        payWithBoleto()
        completePurchase()
        cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
        cy.wait(2000)
        cy.contains(email).should('be.visible')
        cy.contains('Paulo Pipoco').should('be.visible')
        cy.contains('2144443333').should('be.visible')
        cy.contains(PICKUP_TEXT).should('be.visible')
        cy.contains('Loja em Copacabana no Rio de Janeiro').should('be.visible')
        cy.contains('Rua General Azevedo Pimentel 5').should('be.visible')
        cy.contains('Copacabana').should('be.visible')
      })
    })
  })
}
