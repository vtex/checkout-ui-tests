import '@testing-library/cypress/add-commands'

import { baseConfig } from '../../utils'
import {
  CHECKOUT_ENDPOINT,
  DEFAULT_SELLER_ID,
  getBaseURL,
} from '../../utils/constants'
import { fillEmail, fillProfile } from '../../utils/profile-actions'

interface SKU {
  id: string
  quantity: number
  seller?: string
}

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-namespace -- Cypress uses
   * and recommends namespaces to augment the Chainable interface for custom
   * commands.
   *
   * @see https://docs.cypress.io/guides/tooling/typescript-support#Types-for-custom-commands
   */
  namespace Cypress {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any --
     * All declarations of the Chainable interface must follow the same
     * generics signature, so we must use `any` as the default value, and
     * cannot omit the `Subject` generic
     */
    interface Chainable<Subject = any> {
      /**
       * Select and element and wait for the specified time before proceeding
       * @example
       * cy.waitAndGet('.my-element', 1_000)
       */
      waitAndGet(
        selector: any,
        time: number,
        options?: Partial<Withinable & Loggable & Timeoutable & Shadow>
      ): Chainable

      /**
       * Get the iframe body element
       *
       * @example
       * cy.get('iframe').iframe().should('exist')
       */
      iframe(): Chainable

      /**
       * Visit the store with a clean state
       */
      visitAndClearCookies(account: string): Chainable

      /**
       * Creates a cart with the specified items and then visit the given URL
       * @example
       * cy.createCartThenVisit('vtexgame1', [{ id: '289', quantity: 1 }], 'http://localhost:3000/')
       */
      createCartThenVisit(account: string, items: SKU[] | string[]): Chainable

      /**
       * Proceed to Checkout and fill the profile email
       */
      fillEmail(email: string): Chainable

      /**
       * Fill profile data with values
       */
      fillProfile(options?: {
        firstName?: string
        lastName?: string
        country?: string
      }): Chainable

      /**
       * Fill postal code input with value
       */
      fillPostalCode(postalCode: string): Chainable
    }
  }
}

Cypress.Commands.add('waitAndGet', (arg, time, options) => {
  cy.get(arg, options).wait(time).get(arg, options)
})

Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe) => {
  if ($iframe.readyState === 'complete') {
    return $iframe.contents().find('body')
  }

  return new Cypress.Promise((resolve) => {
    $iframe.on('load', () => {
      resolve($iframe.contents().find('body'))
    })
  })
})

Cypress.Commands.add('visitAndClearCookies', (account) => {
  cy.visit(
    getBaseURL({
      ...baseConfig,
      accountName: account,
    }) + CHECKOUT_ENDPOINT
  )
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(3000)
  cy.clearCookies()
  cy.clearLocalStorage()

  if (baseConfig.environment === 'beta') {
    cy.setCookie('vtex-commerce-env', 'beta')
  }

  if (baseConfig.environment === 'io') {
    cy.request(
      'POST',
      `http://api.vtexcommercestable.com.br/api/vtexid/apptoken/login?an=${account}`,
      {
        appkey: baseConfig.appKey,
        apptoken: baseConfig.appToken,
      }
    ).then((response) => {
      cy.setCookie('VtexIdclientAutCookie', response.body.token)
    })
  }
})

Cypress.Commands.add(
  'createCartThenVisit',
  (account, items: SKU[] | string[]) => {
    // Clear previous cookie
    cy.setCookie('checkout.vtex.com', '', {
      domain: 'portal.vtexcommercestable.com.br',
    })

    const visitUrl =
      getBaseURL({
        ...baseConfig,
        accountName: account,
      }) + CHECKOUT_ENDPOINT

    const searchParams = new URLSearchParams()

    searchParams.set('an', account)
    searchParams.set('redirect', 'false')

    items.forEach((sku) => {
      const id = typeof sku === 'object' ? sku.id : sku
      const quantity = typeof sku === 'object' ? sku.quantity : 1
      const seller =
        typeof sku === 'object'
          ? sku.seller ?? DEFAULT_SELLER_ID
          : DEFAULT_SELLER_ID

      searchParams.append('sku', id)
      searchParams.append('qty', quantity.toString())
      searchParams.append('seller', seller)
    })

    cy.request(
      `https://portal.vtexcommercestable.com.br/checkout/cart/add?${searchParams.toString()}`
    ).then((res) => {
      const setCookieResponse = res.headers['set-cookie'] as unknown as string[]

      const checkoutCookieValue =
        setCookieResponse
          .find((setCookieValue) =>
            setCookieValue.startsWith('checkout.vtex.com=')
          )
          ?.split('; ')[0]
          .split('=')
          .slice(1)
          .join('=') ?? ''

      cy.intercept({ url: '/legacy-extensions/checkout?*', times: 1 }).as(
        'runtimeContext'
      )

      cy.setCookie('checkout.vtex.com', checkoutCookieValue)
      cy.visit(visitUrl)

      cy.wait('@runtimeContext').its('response.statusCode').should('eq', 200)
    })
  }
)

Cypress.Commands.add('fillEmail', (email: string) => {
  fillEmail(email)
})

Cypress.Commands.add(
  'fillProfile',
  (options = { firstName: 'auto', lastName: 'auto', country: 'BRA' }) => {
    fillProfile(options)
  }
)

Cypress.Commands.add('fillPostalCode', (postalCode) => {
  cy.intercept({ url: '/api/checkout/pub/postal-code/**', times: 1 }).as(
    'postalCodeRequest'
  )
  cy.intercept({
    url: '/api/checkout/pub/orderForm/**/shippingData',
    times: 1,
  }).as('shippingDataRequest')

  cy.get('#ship-postalCode').type(postalCode)

  cy.wait('@postalCodeRequest')
  cy.wait('@shippingDataRequest')
})
