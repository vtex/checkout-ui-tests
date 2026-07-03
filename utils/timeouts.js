/* eslint-disable no-undef */

/**
 * Central, env-tunable timeouts.
 *
 * These are read from `Cypress.env(...)` at call time (via getters) so any of
 * them can be overridden without editing code, e.g.:
 *
 *   yarn cypress:run --env submitButton=15000,paymentProcessing=90000
 *
 * or in CI via `CYPRESS_submitButton=15000`. When no override is provided the
 * defaults below apply.
 *
 * Why per-command timeouts matter here: Cypress deliberately DISABLES Mocha's
 * per-test (wall-clock) timeout and bounds test duration purely through
 * per-command timeouts + retries. There is no "global test timeout" knob that
 * works — so these command timeouts (together with `retries` in
 * cypress.config.ts) are what actually stop a stuck live request from looping
 * overtime.
 */

function envTimeout(key, fallback) {
  const value = Cypress.env(key)

  return typeof value === 'number' ? value : fallback
}

export const TIMEOUTS = {
  /**
   * Wait for the "buy now" / submit button to become enabled after the payment
   * form is filled. Trimmed from 30s → 20s: if the button hasn't rendered in
   * 20s the checkout is stuck, and (with retries) waiting the full 30s three
   * times over just burns wall-clock. Override: `submitButton`.
   */
  get SUBMIT_BUTTON() {
    return envTimeout('submitButton', 20000)
  },

  /**
   * Wait for the async payment result to settle — the authorized/unauthorized
   * modal, the orderPlaced redirect, etc. Real gateway processing is slow, so
   * this stays generous at 120s. Override: `paymentProcessing`.
   */
  get PAYMENT_PROCESSING() {
    return envTimeout('paymentProcessing', 120000)
  },

  /**
   * Wait for the checkout runtime context request to resolve during setup.
   * Override: `runtimeContext`.
   */
  get RUNTIME_CONTEXT() {
    return envTimeout('runtimeContext', 60000)
  },
}
