import { visitAndClearCookies, setup } from '../../../utils'
import {
  getRandomEmail,
  fillEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import { SKUS, ACCOUNT_NAMES, PERU_TEXT } from '../../../utils/constants'
import {
  selectCountry,
  goToPayment,
  selectPacItem,
} from '../../../utils/shipping-actions'
import { payWithBoleto, completePurchase } from '../../../utils/payment-actions'

export default function test(account) {
  describe(`Delivery - Peru - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('with only delivery', () => {
      const email = getRandomEmail()

      setup({ skus: [SKUS.GLOBAL_PRODUCT], salesChannel: 2, account })

      fillEmail(email)
      fillProfile()

      selectCountry('PER')

      if (account === ACCOUNT_NAMES.GEOLOCATION) {
        cy.get('#ship-addressQuery').type('Av. Javier Prado Este, 2465')

        selectPacItem('Javier Prado')

        cy.get('#ship-receiverName')
          .type('{selectAll}{backspace}Checkout Team')
          .blur()

        cy.contains('Avenida Javier Prado Este 2465')

        // Committing the receiver name / geocoded address triggers a shipping
        // recompute (shippingData POST) that re-renders and detaches the
        // go-to-payment button; blur now and let it settle before advancing
        // (mirrors the non-geo branch and the No number model).
        cy.wait(3000)
      } else {
        cy.get('#ship-state').select('Lima').should('have.value', 'Lima')
        cy.get('#ship-city').select('Lima').should('have.value', 'Lima')
        // Selecting the neighborhood triggers the async render of the street/
        // number fields, which detaches this <select> — so don't chain an
        // assertion onto it (it would fail "detached from the DOM"). Instead,
        // wait for street/number to render enabled before typing, mirroring the
        // reliable Pickup Peru model.
        cy.get('#ship-neighborhood').select('San Borja___150130')

        // #ship-number stays disabled until #ship-street is committed. Type the
        // street and blur it to fire the change event that enables the number
        // field, let the resulting re-render settle, then type the number. We do
        // NOT force the type: forcing into the still-disabled input silently
        // drops the value, leaving the address incomplete and blocking payment.
        cy.get('#ship-street')
          .should('be.enabled')
          .type('Avenida Javier Prado Este')
          .blur()
        cy.wait(1000)
        cy.get('#ship-number').should('be.enabled').type('2465').blur()

        // Committing the number triggers a shipping recompute (shippingData
        // POST) that re-renders the page and transiently detaches the "go to
        // payment" button; wait for it to settle before advancing.
        cy.wait(3000)
      }

      goToPayment()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains(PERU_TEXT).should('be.visible')
      cy.contains('Lima, Lima').should('be.visible')
    })
  })
}
