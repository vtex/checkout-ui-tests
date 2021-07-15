import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import { goToPayment, selectCountry } from '../../../utils/shipping-actions'
import {
  completePurchase,
  fillBillingAddress,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery - Credit Card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.DELIVERY_ARG], account })

      fillEmail(email)
      fillProfile()

      selectCountry('ARG')

      cy.waitAndGet('#ship-addressQuery', 3000).type(
        'Corrientes 240, Las Varillas, Córdoba, Argentina'
      )

      cy.get('.pac-item')
        .first()
        .trigger('mouseover')

      cy.get('.pac-item')
        .first()
        .click()

      cy.contains('Corrientes 240')
      cy.contains('San Justo, Córdoba')

      goToPayment()
      payWithCreditCard()

      fillBillingAddress({
        id: 0,
        postalCode: '5940',
        number: '240',
        street: 'Corrientes',
        city: 'Córdoba',
      })

      // cy.get('#payment-billing-address-postalCode-0').type('5940')

      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Cartão de crédito').should('be.visible')
      cy.contains('final 8936').should('be.visible')
      cy.contains('Receber').should('be.visible')
      cy.contains('Corrientes 240').should('be.visible')
      cy.contains('San Justo').should('be.visible')
    })
  })
}
