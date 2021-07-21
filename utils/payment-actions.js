import { waitLoad } from '.'
import { CREDIT_CARD, FOOD_VOUCHER } from './constants'

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

export function getIframeBody($iframe) {
  return $iframe.contents().find('body')
}

export function queryCreditCardIframe(callback) {
  cy.waitAndGet(
    '#iframe-placeholder-creditCardPaymentGroup > iframe',
    3000
  ).then(callback)
}

export function queryFoodVoucherIframe(callback) {
  cy.waitAndGet(
    '#iframe-placeholder-customPrivate_405PaymentGroup > iframe',
    3000
  ).then(callback)
}

export function fillCreditCardInfo(
  options = {
    withAddress: false,
    id: '0',
  }
) {
  cy.wait(3000)
  cy.get('#payment-group-creditCardPaymentGroup').click({ force: true })

  cy.wait(5000)

  queryCreditCardIframe($iframe => {
    const $body = getIframeBody($iframe)

    // We type with force:true because of https://github.com/cypress-io/cypress/issues/5830
    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Number`)
      .type(CREDIT_CARD.NUMBER, { force: true })

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Name`)
      .type(CREDIT_CARD.NAME, { force: true })

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Brand`)
      .select(CREDIT_CARD.BRAND.VISA)

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Month`)
      .select(CREDIT_CARD.EXPIRATION_DATE_MONTH)

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Year`)
      .select(CREDIT_CARD.EXPIRATION_DATE_YEAR)

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Code`)
      .type(CREDIT_CARD.CVV, { force: true })

    if (!options.withAddress) {
      return
    }

    cy.wrap($body)
      .find(`#payment-billing-address-postalCode-${options.id || '0'}`)
      .type('22071060', { force: true })

    cy.wrap($body)
      .find(`#payment-billing-address-number-${options.id || '0'}`)
      .type('12', { force: true })
  })
}

export function fillFoodVoucherInfo(
  options = {
    withAddress: false,
    id: '0',
  }
) {
  cy.wait(3000)
  cy.get('#payment-group-customPrivate_405PaymentGroup').click({ force: true })

  cy.wait(5000)

  queryFoodVoucherIframe($iframe => {
    const $body = getIframeBody($iframe)

    // We type with force:true because of https://github.com/cypress-io/cypress/issues/5830
    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Number`)
      .type(FOOD_VOUCHER.NUMBER, { force: true })

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Name`)
      .type(FOOD_VOUCHER.NAME, { force: true })

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Brand`)
      .select(FOOD_VOUCHER.BRAND.PRIVATE_LABEL)

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Month`)
      .select(FOOD_VOUCHER.EXPIRATION_DATE_MONTH)

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Year`)
      .select(FOOD_VOUCHER.EXPIRATION_DATE_YEAR)

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Code`)
      .type(FOOD_VOUCHER.CVV, { force: true })

    if (!options.withAddress) {
      return
    }

    cy.wrap($body)
      .find(`#payment-billing-address-postalCode-${options.id || '0'}`)
      .type('22071060', { force: true })

    cy.wrap($body)
      .find(`#payment-billing-address-number-${options.id || '0'}`)
      .type('12', { force: true })
  })
}

export function selectCreditCardGroup() {
  cy.waitAndGet('#payment-group-creditCardPaymentGroup', 3000).click()
}

export function selectFoodVoucherGroup() {
  cy.waitAndGet('#payment-group-customPrivate_405PaymentGroup', 3000).click()
}

export function selectSamsungPayGroup() {
  cy.waitAndGet('#payment-group-SamsungPayPaymentGroup', 3000).click()
}

export function payWithCreditCard(options = { withAddress: false }) {
  selectCreditCardGroup()
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
  queryCreditCardIframe($iframe => {
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
  cy.get('#payment-app-confirm', { timeout: 120000 }).click()
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

  queryCreditCardIframe($iframe => {
    const $body = getIframeBody($iframe)

    cy.wrap($body)
      .find('#creditCardpayment-card-0Brand')
      .select('1')

    cy.wrap($body)
      .find('#creditCardpayment-card-0Code')
      .type('066', { force: true })
  })
}

export function completePurchase() {
  cy.get('.payment-submit-wrap > button.submit:visible').should(
    'not.have.attr',
    'disabled'
  )
  cy.waitAndGet('.payment-submit-wrap > button.submit:visible', 3000).click()
}

export function insertFreeShippingCoupon() {
  cy.get('#cart-link-coupon-add').click({ force: true })
  cy.get('#cart-coupon').type('freeshipping', { force: true })
  cy.get('#cart-coupon-add').click({ force: true })
}

export function payWithFoodVoucher(options = { withAddress: false }) {
  selectFoodVoucherGroup()
  waitLoad()
  fillFoodVoucherInfo({ withAddress: options.withAddress, id: 0 })
}

export function combinePaymentMethods() {
  cy.waitAndGet('#combine-payment-methods', 3000).click()
}
