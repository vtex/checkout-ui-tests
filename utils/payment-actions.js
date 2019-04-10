export function payWithPaymentSlip() {
  cy.wait(3000)
  cy.get('#payment-group-bankInvoicePaymentGroup').click()
  cy.get('#payment-data-submit').should('not.have.attr', 'disabled')
  cy.get('#payment-group-bankInvoicePaymentGroup').click()
}

export function payWithCreditCard(options = { withAddress: false }) {
  cy.wait(5000)
  cy.get('iframe').then($iframe => {
    const $body = $iframe.contents().find('body')

    cy.wrap($body)
      .find('#creditCardpayment-card-0Number')
      .type('4040240009008936')
    cy.wait(1000)

    cy.wrap($body)
      .find('#creditCardpayment-card-0Name')
      .type('Fernando A Coelho')
    cy.wait(1000)

    cy.wrap($body)
      .find('#creditCardpayment-card-0Month')
      .select('02')
    cy.wait(1000)

    cy.wrap($body)
      .find('#creditCardpayment-card-0Year')
      .select('22')
    cy.wait(1000)

    cy.wrap($body)
      .find('#creditCardpayment-card-0Code')
      .type('066')
    cy.wait(1000)

    if (options.withAddress) {
      cy.wrap($body)
        .find('#payment-billing-address-postalCode-0')
        .type('22071060')

      cy.wrap($body)
        .find('#payment-billing-address-number-0')
        .type('12')
    }
  })
}

export function completePurchase() {
  cy.wait(1000)
  cy.get('#payment-data-submit').should('not.have.attr', 'disabled')

  cy.get('#payment-data-submit').click({ force: true })
}
