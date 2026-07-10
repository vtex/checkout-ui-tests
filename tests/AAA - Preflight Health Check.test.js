import { baseConfig } from '../utils'
import { getBaseURL, CHECKOUT_ENDPOINT, Accounts } from '../utils/constants'

/**
 * Pre-flight health-check.
 *
 * This spec runs before the real suite (its "AAA" name sorts it first) to turn
 * the confusing generic "cy.visit() -> 500 Internal Server Error" that every
 * spec hits when auth is broken into a single, actionable failure.
 *
 * Root cause it targets: when `VTEX_AUTH_TOKEN` is empty in the vcs.checkout-ui
 * CI (e.g. because `vtex/action-toolbelt-login` failed to export the token via
 * the deprecated `set-output` command), the local Koa checkout server calls
 * VTEX with an empty `VtexIdclientAutCookie` -> 401/403 -> 500. Because
 * `CYPRESS_VTEX_ENV: local` bypasses client-side cookie fetching, the whole
 * suite fails in `before each` with no clue as to why.
 */
describe('Preflight Health Check', () => {
  it('checkout server responds without an auth/server error', () => {
    const url =
      getBaseURL({
        ...baseConfig,
        accountName: Accounts.DEFAULT,
      }) + CHECKOUT_ENDPOINT

    return cy.request({ url, failOnStatusCode: false }).then((response) => {
      const { status } = response

      if ([500, 401, 403].includes(status)) {
        throw new Error(
          `Preflight health-check failed: checkout server at ${url} returned ${status}.\n` +
            'This almost always means VTEX_AUTH_TOKEN is empty in the vcs.checkout-ui CI ' +
            '(the token exported by vtex/action-toolbelt-login).\n' +
            'Ask infra to verify APP_KEY / APP_TOKEN and the login step output ' +
            '(the deprecated `set-output` command can silently produce an empty token).\n' +
            'Until a valid VTEX_AUTH_TOKEN is restored, every spec will fail in `before each` ' +
            'with a generic 500 on cy.visit().'
        )
      }

      if (![200, 204].includes(status)) {
        throw new Error(
          `Preflight health-check: expected checkout server at ${url} to respond ` +
            `with 200/204 but got ${status}.`
        )
      }
    })
  })
})
