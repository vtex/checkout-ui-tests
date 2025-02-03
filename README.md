# Checkout UI Test Engine

[![Build Status](https://drone-robots.vtex.com/api/badges/vtex/checkout-ui-tests/status.svg)](https://drone-robots.vtex.com/vtex/checkout-ui-tests)

## Description

The repository for mapped and implemented purchase end-to-end testing scenarios for the Checkout UI.

The test engine is composed by four main utilities:

- **Cypress** - the tool for developing and running end-to-end tests
- **Github Actions** - where the actual tests are run
- **Horus Files** - AWS Lambda function used to send test result videos to s3
- **Horus Proxy** - AWS Lambda function to send status to monitoring

This repo has two Github Actions (BETA and STABLE) with a cron schedule to run all tests using Cypress, then sending videos to s3, evidences and the run result to monitoring.

## Manual usage

This repository uses a GitHub Workflow Action to trigger the end-to-end tests execution on our [Cypress Dashboard project](https://dashboard.cypress.io/projects/kobqo4/).

To trigger this workflow, follow those steps:

1. Access the [End-to-End tests GitHub Workflow](https://github.com/vtex/checkout-ui-tests/actions/workflows/main.yml)
2. Click in the `Run workflow` button and fill the form
3. After triggering the workflow, wait for about one minute and check the [Checkout UI Cypress Dashboard page](https://dashboard.cypress.io/projects/kobqo4/) to find your run.

> ℹ️ Running the complete suite with 30 containers take about ~11 minutes to end.

> ⚠️ Also, each complete suite run cost about \$1, so be mindful about how many executions are being made. To better understand how this is billed, check the [Cypress pricing page](https://www.cypress.io/pricing/).

You can also trigger this action via the GitHub CLI using `gh workflow run`.

## Developing

To implement a test or just run a test individually run the following command and the Cypress ui should open:

```sh
$ yarn cypress
```

Optional parameters can be set such as `environment` and vtex io `workspace` as follows:

```sh
$ yarn cypress --env VTEX_ENV={{local|beta|stable|io|beta-io}}
$ yarn cypress --env VTEX_WORKSPACE={{example_workspace}}
```

Multiple parameters should be separated by comma, e.g.:

```sh
$ yarn cypress --env VTEX_ENV=beta,VTEX_WORKSPACE=myWorkspace
```

> Optionally, you can also set them as regular environment variables in your
> shell, just prepend them with `CYPRESS_`, for example `CYPRESS_VTEX_ENV`

To run ALL tests without sending to monitoring run:

```sh
$ yarn cypress:run
```

To run the suite locally actually sending the results to monitoring run:

**disclaimer** - you should have `HORUS_PROXY_KEY` and `HORUS_FILES_KEY` API keys in a `.env` file for the results and videos to be sent to monitoring.

```sh
$ yarn test # for tests using STABLE environment
$ yarn test:beta # for tests using BETA environment
```

### Environments

We currently support 4 different environments values (which are passed as `VTEX_ENV`), and this sections explains each one.

- `stable`: This is our usual environment for testing. It opens the tests using
  the `vtexcommercestable.com.br` domain, and uses Portal V2 as the rendering
  backend. It is expected that all tests pass when using this environment.
- `beta`: This is the environment we use for testing prerelease versions. It
  uses the `vtexcommercebeta.com.br` domain, and also uses Portal V2 as the
  rendering backend. This environment will use all beta versions of the
  services (both UI and API), and is not expected that all tests pass.
- `io`: This is our newest environment, and what we hope to replace `stable`
  with. This opens our testing environment using the `myvtex.com` domain, and
  uses the new [Portal IO](https://github.com/vtex/portal-io) rendering
  backend. It requires two environment variables to be able to access myvtex
  without authentication: `APP_KEY` and `APP_TOKEN`. It is also expected that
  all tests pass when using this environment.
- `beta-io`: This is an older environment which we used for running the stable
  tests on a prerelease version of `omnishipping` or `shipping-preview`. It
  uses the `vtexcommercestable.com.br` domain, but with the workspace `beta`.
  We used to link (or install) the version we wanted to test in this workspace
  of our tests accounts and wait for the result on the healthcheck page. This
  was mainly used for running tests on a development version, so the tests were
  not expected to pass.

### Actions

In the `utils` folder you have at your disposal a series of implemented actions for each step of the checkout process, making it easier to implement a new scenario.

**Profile**

- `fillEmail` - Fills a given email at the `orderForm` step of the checkout
- `fillProfile` - Fills the profile form with a user data
- `getRandomEmail` - Returns a random email for the first purchase scenario
- `getSecondPurchaseEmail` - Returns the `segunda-compra@mailinator.com` email for recurring purchases
- `confirmSecondPurchase` - After identifying with the second purchase email confirms the identification modal
- `login` - simulates the login flow

**Shipping**

- `unavailableDeliveryGoToPickup` - Goes to pickup if an item doesn't have delivery options
- `fillShippingInformation` - Fills shipping information such as postal code and the remaining address form
- `fillRemainingInfo` - Clicks in the remaining info button after a pickup is selected in split (delivery/pickup) scenarios
- `goToPayment` - Goes to payment step
- `chooseDelivery` - Selects Delivery tab at shipping step
- `choosePickup` - Selects Pickup tab at shipping step
- `fillShippingPreviewDelivery` - Fills delivery information in shipping preview
- `choosePickupShippingPreview` - Selects Delivery tab at cart step
- `chooseDeliveryShippingPreview` - Selects Pickup tab at cart step
- `chooseDeliveryDate` - Selects a date for scheduled options
- `fillPickupAddress` - Searches for an address in the pickup points modal
- `goToInvoiceAddress` - Selects go to invoice address to open this step
- `fillInvoiceAddress` - Fills the invoice address information

**Payment**

- `payWithBoleto` - Selects Boleto payment method
- `payWithCreditCard` - Selects Credit card payment method
- `typeCVV` - Types CVV for recurring purchases
- `completePurchase` - Clicks finish purchase button
- `fillCreditCardAndSelectInstallmentWithInterest` - Fills credit card with Elo flag and select an installment with interest
- `fillGiftCard` - Opens Gift card input and fills with a voucher
- `selectWHGooglePay` - Selects Google Pay payment method

**Summary**

- `goBackToCart` - Turns back from the checkout to cart

## Contributing

The main purpose of this repository build a more effective e2e test suite for the Checkout UI. Read below to learn how you can contribute.

### [Contributing Guide](https://github.com/vtex/checkout-ui-tests/blob/master/CONTRIBUTING.md)

Read the [contributing guide](https://github.com/vtex/checkout-ui-tests/blob/master/CONTRIBUTING.md) to learn about the development process and how to build a new test scenario.

## Old removed tests

In the end of 2021 we realized that some all-time-broken tests were impacting our confiability, so we decided to fix them. Unfortunately some of them represented real bugs with Checkout, but after finding out how rare and hard to fix those scenarios were, some investigation, we opted to just discard those tests.

Those tests were:

- \[Shipping\] Delivery + Scheduled Delivery and Delivery - Credit card (vtexgame1, clean, geo, invoice, nolean)
- [Shipping Preview] Delivery + Scheduled Delivery + Pickup (vtexgame1nolean)
- [Shipping Preview] Delivery + Scheduled Delivery + Scheduled Pickup (vtexgame1nolean)
- [Shipping Preview] Delivery Only + Delivery Pickup (vtexgame1nolean)

You can check them using version control ([last commit before removal](https://github.com/vtex/checkout-ui-tests/tree/65f0b6ce9f70dcbea5a0ec77567d5aa380809b4b)) but additional information can be found [here](https://www.notion.so/vtexhandbook/Ressurrei-o-de-testes-E2E-e1b3fcea081342e2bcd1defedd0dddab).
