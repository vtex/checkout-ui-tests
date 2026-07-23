import { defineConfig } from 'cypress'

/**
 * Read a numeric setting from an env var, falling back to a default.
 *
 * Cypress maps `CYPRESS_<name>` env vars onto config automatically, but only
 * for known config keys; for our own tuning we read them explicitly here so a
 * run can be tuned without editing code, e.g.:
 *
 *   CYPRESS_RETRIES=0 yarn cypress:run
 *   CYPRESS_PAGE_LOAD_TIMEOUT=60000 yarn cypress:run
 */
function numberFromEnv(name: string, fallback: number): number {
  const raw = process.env[name]
  const parsed = raw == null ? NaN : Number(raw)

  return Number.isFinite(parsed) ? parsed : fallback
}

export default defineConfig({
  chromeWebSecurity: false,
  blockHosts: ['www.googletagmanager.com'],
  video: false,
  projectId: 'kobqo4',
  // A page that hasn't loaded in 90s against a live store is stuck, not slow.
  // Trimmed from 180s so a hung navigation fails fast instead of adding minutes
  // per (retried) attempt. Override: CYPRESS_PAGE_LOAD_TIMEOUT.
  pageLoadTimeout: numberFromEnv('CYPRESS_PAGE_LOAD_TIMEOUT', 90000),
  defaultCommandTimeout: numberFromEnv(
    'CYPRESS_DEFAULT_COMMAND_TIMEOUT',
    15000
  ),
  // Bound how long we wait on network round-trips so a slow/failing live
  // request fails fast rather than hanging. Overrides: CYPRESS_REQUEST_TIMEOUT,
  // CYPRESS_RESPONSE_TIMEOUT.
  requestTimeout: numberFromEnv('CYPRESS_REQUEST_TIMEOUT', 15000),
  responseTimeout: numberFromEnv('CYPRESS_RESPONSE_TIMEOUT', 30000),
  retries: {
    // Was 2 (3 attempts total). Each retry re-runs the full ~90s setup before
    // failing again, so a genuinely broken/declined live flow could burn ~5min
    // "looping". Dropped to 1 (2 attempts) — still absorbs a single transient
    // 5xx/timeout without tripling the cost. Override: CYPRESS_RETRIES.
    runMode: numberFromEnv('CYPRESS_RETRIES', 1),
    openMode: numberFromEnv('CYPRESS_RETRIES_OPEN', 0),
  },
  e2e: {
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name !== 'chrome') {
          return
        }

        launchOptions.args.push('--disable-site-isolation-trials')
      })
    },
    specPattern: 'tests/**/*.test.{js,ts}',
  },
})
