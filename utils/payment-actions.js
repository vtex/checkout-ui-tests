export function payWithPaymentSlip() {
  cy.wait(5000)
  cy.get("#payment-group-bankInvoicePaymentGroup").click({ force: true })
  cy.wait(3000)
  cy.get("#payment-data-submit").should("not.have.attr", "disabled")
  cy.get("#payment-group-bankInvoicePaymentGroup").click({ force: true })
}

function getIframeBody($iframe) {
  return $iframe.contents()
}

function queryIframe(callback) {
  cy.get("iframe").then(callback)
}

export function payWithCreditCard(options = { withAddress: false }) {
  cy.wait(5000)

  queryIframe($iframe => {
    cy.wrap(getIframeBody($iframe))
      .find("#creditCardpayment-card-0Number")
      .type("4040240009008936")
  })

  queryIframe($iframe => {
    cy.wrap(getIframeBody($iframe))
      .find("#creditCardpayment-card-0Name")
      .type("Fernando A Coelho")
    cy.wait(1000)
  })

  queryIframe($iframe => {
    cy.wrap(getIframeBody($iframe))
      .find("#creditCardpayment-card-0Brand")
      .select("1")
    cy.wait(1000)
  })

  queryIframe($iframe => {
    cy.wrap(getIframeBody($iframe))
      .find("#creditCardpayment-card-0Month")
      .select("02")
    cy.wait(1000)
  })

  queryIframe($iframe => {
    cy.wrap(getIframeBody($iframe))
      .find("#creditCardpayment-card-0Year")
      .select("22")
    cy.wait(1000)
  })

  queryIframe($iframe => {
    cy.wrap(getIframeBody($iframe))
      .find("#creditCardpayment-card-0Code")
      .type("066")
    cy.wait(1000)
  })

  if (options.withAddress) {
    queryIframe($iframe => {
      cy.wrap(getIframeBody($iframe))
        .find("#payment-billing-address-postalCode-0")
        .type("22071060")
    })

    queryIframe($iframe => {
      cy.wrap(getIframeBody($iframe))
        .find("#payment-billing-address-number-0")
        .type("12")
    })
  }
}

export function typeCVV() {
  cy.wait(5000)

  queryIframe($iframe => {
    cy.wrap(getIframeBody($iframe))
      .find("#creditCardpayment-card-0Brand")
      .select("1")
    cy.wait(1000)
  })

  queryIframe($iframe => {
    cy.wrap(getIframeBody($iframe))
      .find("#creditCardpayment-card-0Code")
      .type("066")
    cy.wait(1000)
  })
}

export function completePurchase() {
  cy.wait(1000)
  cy.get("#payment-data-submit").should("not.have.attr", "disabled")

  cy.get("#payment-data-submit").click({ force: true })
}
