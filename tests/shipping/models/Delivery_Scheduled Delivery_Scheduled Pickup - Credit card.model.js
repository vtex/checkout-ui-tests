import { setup, visitAndClearCookies } from '../../../utils'
import {
  SKUS,
  DELIVERY_TEXT,
  PICKUP_TEXT,
  SCHEDULED_TEXT,
} from '../../../utils/constants'
import { goToInvoiceAddress } from '../../../utils/invoice-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import {
  fillEmail,
  fillProfile,
  getRandomEmail,
} from '../../../utils/profile-actions'
import {
  chooseDeliveryDate,
  choosePickupDate,
  fillPickupAddress,
  fillRemainingInfo,
  fillShippingInformation,
  goToPayment,
  unavailableDeliveryGoToPickup,
} from '../../../utils/shipping-actions'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery + Scheduled Pickup - Credit card - ${account}`, () => {
    beforeEach(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled delivery and scheduled pickup', () => {
      const email = getRandomEmail()

      setup({
        skus: [
          SKUS.DELIVERY_CUSTOMIZATION_ATTACHMENT,
          SKUS.SCHEDULED_DELIVERY,
          SKUS.SCHEDULED_PICKUP,
        ],
        account,
      })

      fillEmail(email)
      fillProfile()
      unavailableDeliveryGoToPickup()
      fillPickupAddress(account)
      fillRemainingInfo()
      fillShippingInformation(account)
      choosePickupDate({ account })
      chooseDeliveryDate({
        account,
        shouldActivate: false,
      })
      goToInvoiceAddress(account)
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains(DELIVERY_TEXT).should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
      cy.contains(SCHEDULED_TEXT).should('be.visible')
      cy.contains(PICKUP_TEXT).should('be.visible')
    })
  })
}
