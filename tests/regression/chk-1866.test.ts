import { visitAndClearCookies, setup } from '../../utils'
import { Accounts, SKUs } from '../../utils/constants'
import { calculateShippingPreview } from '../../utils/shipping-actions'

describe('CHK-1866', () => {
  describe(`${Accounts.DEFAULT}`, () => {
    beforeEach(() => {
      visitAndClearCookies(Accounts.DEFAULT)
    })

    it('should the price shown in the shipping preview will be the same as shown in the cart summary', () => {
      setup({
        skus: [SKUs.ONLY_PICKUP_2_SLA_RJ, SKUs.SCHEDULED_DELIVERY_SLA_RJ],
        salesChannel: '1',
        account: Accounts.DEFAULT,
      })

      calculateShippingPreview()

      cy.get('#ship-postalCode').type('22250-040')
      cy.wait(3000)

      cy.get('.srp-shipping-current-single__price').then(
        ($shippingPreviewPrice) => {
          const shippingPreviewPrice = $shippingPreviewPrice.text()

          cy.wait(3000)

          cy.get(
            '.summary-template-holder .summary-totalizers .srp-summary-result .monetary'
          ).then(($field) => {
            const price = $field.first().text()
            const priceFormated = price.replace('A partir de ', '')

            expect(shippingPreviewPrice).equal(priceFormated)
          })
        }
      )
    })
  })
})
