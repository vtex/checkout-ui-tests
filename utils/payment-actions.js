import { waitLoad } from '.'

export function payWithBoleto() {
  cy.get('#payment-group-bankInvoicePaymentGroup:visible').click()
  cy.get('#payment-data-submit').should('not.have.attr', 'disabled')
  cy.get('#payment-group-bankInvoicePaymentGroup:visible').click()
}

export function payWithPromissoryPaymentApp() {
  cy.wait(5000)
  cy.get('#payment-group-custom205PaymentGroupPaymentGroup').click({
    force: true,
  })
  cy.wait(3000)
  cy.get('#payment-data-submit').should('not.have.attr', 'disabled')
  cy.get('#payment-group-custom205PaymentGroupPaymentGroup').click({
    force: true,
  })
}

function getIframeBody($iframe) {
  return $iframe.contents().find('body')
}

function queryIframe(callback) {
  cy.waitAndGet(
    '#iframe-placeholder-creditCardPaymentGroup > iframe',
    3000
  ).then(callback)
}

export function fillCreditCardInfo(
  options = {
    withAddress: false,
    id: '0',
    cardNumber: '4040240009008936',
  }
) {
  cy.wait(3000)
  cy.get('#payment-group-creditCardPaymentGroup').click({ force: true })

  cy.wait(5000)

  queryIframe($iframe => {
    const $body = getIframeBody($iframe)
    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Number`)
      .type(options.cardNumber)

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Name`)
      .type('Fernando A Coelho')

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Brand`)
      .select('1')

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Month`)
      .select('02')

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Year`)
      .select('22')

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Code`)
      .type('066')

    if (options.withAddress) {
      cy.wrap($body)
        .find(`#payment-billing-address-postalCode-${options.id || '0'}`)
        .type('22071060')

      cy.wrap($body)
        .find(`#payment-billing-address-number-${options.id || '0'}`)
        .type('12')
    }

    cy.wrap($body)
      .find(`#payment-billing-address-postalCode-${options.id || '0'}`)
      .type('22071060')

    cy.wrap($body)
      .find(`#payment-billing-address-number-${options.id || '0'}`)
      .type('12')
  })
}

export function payWithCreditCard(options = { withAddress: false }) {
  cy.waitAndGet('#payment-group-creditCardPaymentGroup', 3000).click()
  waitLoad()
  fillCreditCardInfo({ withAddress: options.withAddress, id: 0 })
}

export function payWithTwoCreditCards(options = { withAddress: false }) {
  cy.waitAndGet('#payment-group-creditCardPaymentGroup', 3000).click()
  waitLoad()
  selectTwoCards()
  fillCreditCardInfo({ withAddress: options.withAddress, id: 0 })
  fillCreditCardInfo({ withAddress: options.withAddress, id: 1 })
}

export function selectTwoCards() {
  cy.waitAndGet('#payment-group-creditCardPaymentGroup', 1000).click()
  queryIframe($iframe => {
    const $body = getIframeBody($iframe)
    cy.wrap($body)
      .find('.ChangeNumberOfPayments a:visible')
      .click()
  })
}

export function payWithPaymentAppCreditCard(options = { withAddress: false }) {
  fillCreditCardInfo({
    ...options,
    id: 0,
    cardNumber: '5555444433332222',
  })
}

export function confirmPaymentApp() {
  cy.get('#payment-app-confirm', { timeout: 10000 }).click()
}

export function confirmRedirect() {
  cy.get('a', { timeout: 10000 })
    .first()
    .click()
}

export function typeCVV() {
  waitLoad()
  cy.waitAndGet('#payment-group-creditCardPaymentGroup', 1000).click()
  waitLoad()

  queryIframe($iframe => {
    const $body = getIframeBody($iframe)

    cy.wrap($body)
      .find('#creditCardpayment-card-0Brand')
      .select('1')

    cy.wrap($body)
      .find('#creditCardpayment-card-0Code')
      .type('066')
  })
}

export function completePurchase() {
  cy.get('.payment-submit-wrap > button.submit:visible').should(
    'not.have.attr',
    'disabled'
  )
  cy.waitAndGet('.payment-submit-wrap > button.submit:visible', 3000).click()
}
