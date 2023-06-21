import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  blockHosts: ['www.googletagmanager.com'],
  video: false,
  projectId: 'kobqo4',
  pageLoadTimeout: 180000,
  defaultCommandTimeout: 15000,
  retries: {
    runMode: 2,
    openMode: 0,
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
