# Checkout UI Test Engine

## Description

The repository for mapped and implemented purchase testing scenarios for the Checkout UI.

The test engine is composed by four main utilities:

- **Cypress** - the tool for developing and running end-to-end tests
- **Github Actions** - where the actual tests are run
- **Horus Files** - AWS Lambda function used to send test result videos to s3
- **Horus Proxy** - AWS Lambda function to send status to monitoring

This repo has two Github Actions (BETA and STABLE) with a cron schedule to run all tests using Cypress, then sending videos to s3, evidences and the run result to monitoring.

## Developing

To implement a test or just run a test individually run the following command and the Cypress ui should open:

```sh
$ yarn cypress
```

Optional parameters can be set such as `environment` and vtex io `workspace` as follows:

```sh
$ yarn cypress --env VTEX_ENV={{local|beta|stable}}
$ yarn cypress --env VTEX_WORKSPACE={{example_workspace}}
```

Multiple parameters should be separated by comma, e.g.:

```sh
$ yarn cypress --env VTEX_ENV=beta,VTEX_WORKSPACE=myWorkspace
```

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

**Summary**

- `goBackToCart` - Turns back from the checkout to cart

## Contributing

The main purpose of this repository build a more effective e2e test suite for the Checkout UI. Read below to learn how you can contribute.

### [Contributing Guide](https://github.com/vtex/checkout-ui-tests/blob/master/CONTRIBUTING.md)

Read the [contributing guide](https://github.com/vtex/checkout-ui-tests/blob/master/CONTRIBUTING.md) to learn about the development process and how to build a new test scenario.
