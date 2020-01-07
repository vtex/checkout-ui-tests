import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from '../../../utils/profile-actions'
import {
  goToPayment,
  chooseDeliveryDate,
  fillShippingInformation,
  unavailableDeliveryGoToPickup,
  fillPickupAddress,
  fillRemainingInfo,
} from '../../../utils/shipping-actions'
import {
  completePurchase,
  payWithCreditCard,
} from '../../../utils/payment-actions'
import { goToInvoiceAddress } from '../../../utils/invoice-actions'
import {
  SKU_PICKUP_1_SLA,
  SKU_SCHEDULED_DELIVERY,
  SKU_DELIVERY_CUSTOMIZATION_ATTACHMENT
} from '../../../utils/constants'

export default function test(account) {
  describe(`Delivery + Scheduled Delivery + Pickup - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('delivery with scheduled delivery and pickup point', () => {
      const email = getRandomEmail()
      setup({
        skus: [
          SKU_PICKUP_1_SLA,
          SKU_SCHEDULED_DELIVERY,
          SKU_DELIVERY_CUSTOMIZATION_ATTACHMENT,
        ],
        account,
      })

      fillEmail(email)
      fillProfile()
      unavailableDeliveryGoToPickup()
      fillPickupAddress(account)
      fillRemainingInfo()
      fillShippingInformation(account)
      chooseDeliveryDate({ shouldActivate: true })
      goToInvoiceAddress(account)
      goToPayment()
      payWithCreditCard()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Fernando Coelho').should('be.visible')
      cy.contains('5521999999999').should('be.visible')
      cy.contains('Receber').should('be.visible')
      cy.contains('Rua Saint Roman 12').should('be.visible')
      cy.contains('Copacabana').should('be.visible')
      cy.contains('Agendada').should('be.visible')
      cy.contains('Retirar').should('be.visible')
    })
  })
}
