/* eslint-disable no-undef */
import { baseConfig, waitLoad } from '.'
import { ACCOUNT_NAMES, CHECKOUT_ENDPOINT, getBaseURL } from './constants'

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

/**
 * @param {string} account
 */
export function selectWHGooglePay(account) {
  cy.intercept({
    method: 'GET',
    url: 'https://wallet-hub.services.vtexpayments.com/wallet-hub/pub/wallets/googlePay/merchant-info*',
    query: { merchantOrigin: '*', an: account },
  }).as('walletHubMerchantInfo')

  cy.waitAndGet('[id="payment-group-WH Google PayPaymentGroup"]', 3000).click({
    force: true,
  })

  cy.wait(3000)

  cy.wait('@walletHubMerchantInfo')
    .its('response')
    .then((response) => {
      expect(response).to.have.property('statusCode', 200)
      expect(response.body).to.have.property('allowedAuthMethods')
      expect(response.body).to.have.property('merchantId')
      expect(response.body).to.have.property('merchantName')
      expect(response.body).to.have.property('merchantOrigin')
      expect(response.body).to.have.property('authJwt')
    })
}

export function getIframeBody($iframe) {
  return $iframe.contents().find('body')
}

export function queryIframe(callback) {
  cy.waitAndGet(
    '#iframe-placeholder-creditCardPaymentGroup > iframe',
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

  queryIframe(($iframe) => {
    const $body = getIframeBody($iframe)

    // We type with force:true because of https://github.com/cypress-io/cypress/issues/5830
    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Number`)
      .type('4040240009008936', { force: true })

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Name`)
      .type('Fernando A Coelho', { force: true })

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Brand`)
      .select('1')

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Month`)
      .select('02')

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Year`)
      .select(getCreditCardExpiryYear())

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Code`)
      .type('066', { force: true })

    if (!options.withAddress) {
      return
    }

    fillBillingAddress({ id: options.id, postalCode: '22071060', number: '12' })
  })
}

export function fillBillingAddress(options) {
  queryIframe(($iframe) => {
    const $body = getIframeBody($iframe)

    const id = options.id || '0'

    // We type with force:true because of https://github.com/cypress-io/cypress/issues/5830
    if (options.postalCode !== undefined)
      cy.wrap($body)
        .find(`#payment-billing-address-postalCode-${id}`)
        .type(options.postalCode, { force: true })

    if (options.number !== undefined)
      cy.wrap($body)
        .find(`#payment-billing-address-number-${id}`)
        .type(options.number, { force: true })

    if (options.street !== undefined)
      cy.wrap($body)
        .find(`#payment-billing-address-street-${id}`)
        .type(options.street, { force: true })

    if (options.city !== undefined)
      cy.wrap($body)
        .find(`#payment-billing-address-city-${id}`)
        .select(options.city)
  })
}

export function selectCreditCardGroup() {
  cy.waitAndGet('#payment-group-creditCardPaymentGroup', 3000).click()
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
  queryIframe(($iframe) => {
    const $body = getIframeBody($iframe)

    cy.wrap($body).find('.ChangeNumberOfPayments a:visible').click()
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
  cy.get('a', { timeout: 10000 }).first().click()
}

export function typeCVV() {
  waitLoad()
  cy.waitAndGet('#payment-group-creditCardPaymentGroup', 1000).click()
  waitLoad()

  queryIframe(($iframe) => {
    const $body = getIframeBody($iframe)

    cy.wrap($body).find('#creditCardpayment-card-0Brand').select('1')

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

export function goBackToShipping() {
  cy.get('#open-shipping').click()
}

export function fillCreditCardAndSelectInstallmentWithInterest(
  options = {
    withAddress: false,
    id: '0',
  }
) {
  cy.wait(3000)
  cy.get('#payment-group-creditCardPaymentGroup').click({ force: true })

  cy.wait(5000)

  queryIframe(($iframe) => {
    const $body = getIframeBody($iframe)

    // We type with force:true because of https://github.com/cypress-io/cypress/issues/5830
    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Number`)
      .type('5090691111111118', { force: true })

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Name`)
      .type('Fernando A Coelho', { force: true })

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Brand`)
      .select('3')

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Month`)
      .select('02')

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Year`)
      .select(getCreditCardExpiryYear())

    cy.wrap($body)
      .find(`#creditCardpayment-card-${options.id || '0'}Code`)
      .type('066', { force: true })

    if (!options.withAddress) {
      return
    }

    fillBillingAddress({ id: options.id, postalCode: '22071060', number: '12' })
  })
}

export function fillGiftCard(
  options = {
    voucher: false,
  }
) {
  cy.wait(3000)
  cy.get('#show-gift-card-group').click()

  cy.wait(5000)

  cy.waitAndGet('#payment-discounts-code', 3000).type(options.voucher)

  cy.get('#btn-add-gift-card').click()
}

export function visitPayment({ account = ACCOUNT_NAMES.DEFAULT, orderFormId }) {
  cy.visit({
    url: `${getBaseURL({
      ...baseConfig,
      accountName: account,
    })}${CHECKOUT_ENDPOINT}?orderFormId=${orderFormId}#/payment`,
    method: 'GET',
  })
}

function getCreditCardExpiryYear() {
  return ((new Date().getFullYear() % 100) + 1).toString()
}
