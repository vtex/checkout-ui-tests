export function payWithBoleto() {
  cy.wait(5000)
  cy.get("#payment-group-bankInvoicePaymentGroup").click({ force: true })
  cy.wait(3000)
  cy.get("#payment-data-submit").should("not.have.attr", "disabled")
  cy.get("#payment-group-bankInvoicePaymentGroup").click({ force: true })
}

function getIframeBody($iframe) {
  return $iframe.contents().find("body")
}

function queryIframe(callback) {
  cy.get("#iframe-placeholder-creditCardPaymentGroup > iframe").then(callback)
}

export function payWithCreditCard(options = { withAddress: false, id: "0" }) {
  cy.get("#payment-group-creditCardPaymentGroup").click({ force: true })

  cy.wait(5000)

  queryIframe($iframe => {
    cy.wrap(getIframeBody($iframe))
      .find(`#creditCardpayment-card-${options.id || "0"}Number`)
      .type("4040240009008936")

    cy.wrap(getIframeBody($iframe))
      .find(`#creditCardpayment-card-${options.id || "0"}Name`)
      .type("Fernando A Coelho")
    cy.wait(1000)

    cy.wrap(getIframeBody($iframe))
      .find(`#creditCardpayment-card-${options.id || "0"}Brand`)
      .select("1")
    cy.wait(1000)

    cy.wrap(getIframeBody($iframe))
      .find(`#creditCardpayment-card-${options.id || "0"}Month`)
      .select("02")
    cy.wait(1000)

    cy.wrap(getIframeBody($iframe))
      .find(`#creditCardpayment-card-${options.id || "0"}Year`)
      .select("22")
    cy.wait(1000)

    cy.wrap(getIframeBody($iframe))
      .find(`#creditCardpayment-card-${options.id || "0"}Code`)
      .type("066")
    cy.wait(1000)

    if (options.withAddress) {
      cy.wrap(getIframeBody($iframe))
        .find(`#payment-billing-address-postalCode-${options.id || "0"}`)
        .type("22071060")
      cy.wrap(getIframeBody($iframe))
        .find(`#payment-billing-address-number-${options.id || "0"}`)
        .type("12")
    }
  })
}

export function payWithTwoCreditCards(options = { withAddress: false }) {
  cy.wait(5000)

  queryIframe($iframe => {
    const $body = getIframeBody($iframe)

    selectTwoCards()
    payWithCreditCard({ withAddress: options.withAddress, id: 0 })
    payWithCreditCard({ withAddress: options.withAddress, id: 1 })
  })
}

export function selectTwoCards() {
  queryIframe($iframe => {
    const $body = getIframeBody($iframe)

    cy.wrap($body)
      .find(".ChangeNumberOfPayments a")
      .click()
  })
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
