# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.19.1] - 2023-07-11

### Fixed

- Fill billing address when invoice data does not have postal code
- Skip Google Pay test

### Added

- Regression test for task CHK-2308.

## [0.19.0] - 2023-06-21

### Added

- Decreasing the number of parallel containers
- Removing dead code
- Disabled recording for Github Actions

## [0.18.0] - 2023-06-21

### Added

- Regression test for task CHK-1969.

## [0.17.0] - 2023-06-21

### Changed

- Increasing timeout minutes to ensure that all tests have enough time

### Added

- Test for Google Pay payment method

## [0.16.0] - 2023-06-05

### Added

- Added a regression test for task CHK-2201

## [0.15.0] - 2023-06-05

- Updating the number of parallel containers in the setup workflow

## [0.14.0] - 2023-06-05

## Changed

- Increasing the number of parallel containers

## [0.13.3] - 2023-06-05

### Changed

- Fixed monitoring build

## [0.13.2] - 2023-06-05

### Changed

- Updating cypress docker image

## [0.13.1] - 2023-06-02

### Fixed

- Fixed CYPRESS_RECORD_KEY reference in the CI config

## [13.0.0] - 2023-06-02

### Changed

- Migrating to Cypress @ 10.11.0

## [0.12.1] - 2023-04-25

### Fixed

- Scheduled pickup tests failing due to change in pickup order.

## [0.12.0] - 2023-04-04

### Added

- Regression test for task CHK-2059.

## [0.11.4] - 2022-12-23

### Fixed

- Invalid cep string.

## [0.11.3] - 2022-11-22

### Removed

- Checkout UI (IO) module from healthcheck.

## [0.11.2] - 2022-11-22

### Changed

- Flaky test disabled during BF week

## [0.11.1] - 2022-11-04

### Added

- Regression tests for task CHK-1904.

## [0.11.0] - 2022-10-26

### Changed

- Upgrade Cypress to major 9.

## [0.10.0] - 2022-09-06

### Added

- Test for pickup purchases with pre-filled profile and shipping info.

## [0.9.2] - 2022-07-26

### Fixed

- Credit card test failing due to invalid expiry date.

## [0.9.1] - 2022-06-30

### Fixed

- Masks assertions on orderPlaced screen

## [0.9.0] - 2022-06-28

### Added

- Test for Gift card covering the full order value

## [0.8.17] - 2022-06-06

## [0.8.16] - 2022-04-09

## [0.8.15] - 2022-04-09

## [0.8.14] - 2022-04-08

## [0.8.13] - 2022-04-07

## [0.8.12] - 2022-04-06

## [0.8.11] - 2022-04-05

## [0.8.10] - 2022-04-05

## [0.8.9] - 2022-04-05

## [0.8.8] - 2022-04-05

## [0.8.7] - 2022-04-04

## [0.8.6] - 2022-04-04

## [0.8.5] - 2022-04-04

## [0.8.4] - 2022-04-04

## [0.8.3] - 2022-04-04

## [0.8.2] - 2022-04-04

## [0.8.1] - 2022-04-04

## [0.8.0] - 2022-04-04

### Added

- New module on healthcheck.

### Changed

- Update healthcheck title when `VTEX_ENV` is `io`.

## [0.7.0] - 2022-03-21

## [0.6.0] - 2022-03-15

## [0.5.13] - 2022-03-04

### Fixed

- Credit card expiration.

## [0.5.12] - 2022-02-15

### Changed

- Street name at `Delivery - Geolocation Input.model.js`
- Fix spec's default value

## [0.5.11] - 2021-12-23

### Removed

- Outdated and broken tests

### Changed

- Documentation

## [0.5.10] - 2021-12-23

### Fixed

- Test that failed on weekends (all accounts).

## [0.5.9] - 2021-12-17

### Fixed

- Test that failed on weekends (testing fix for single account).

## [0.5.8] - 2021-12-03

### Fixed

- 'No zipcode' test.

## [0.5.7] - 2021-12-02

### Fixed

- 'No number' test.

## [0.5.6] - 2021-11-22

### Added

- Test to ensure that interest infos are displayed at `checkout` and `orderPlaced` pages

## [0.5.5] - 2021-10-25

### Added

- Test to ensure that is possible to update billing address after error
- Test to ensure that form fields are validated after error

## [0.5.4] - 2021-10-12

### Added

- Test to validate finish purchase for free.

## [0.5.3] - 2021-09-28

### Fixed

- Some tests breaking due to undefined variables. Reverts v0.5.2

## [0.5.2] - 2021-09-28 [YANKED]

### Added

- Test to validate finish purchase using credit card and food voucher.

## [0.5.1] - 2021-08-02

### Added

- Test to validate the requirement of zipcode for billing address.

## [0.5.0] - 2021-07-30

### Added

- Test for invoice address without zipcode.

## [0.4.9] - 2021-07-29

### Added

- Test to guarantee the geolocation input is being shown correctly.

## [0.4.8] - 2021-07-08

### Added

- Test for cities/states with no match in our lists.

## [0.4.7] - 2021-07-08

### Added

- Test for geolocation in Paraguay without postal code.
- Tests for geolocation when no number is provided.

## [0.4.6] - 2021-06-01

### Changed

- Revert changes of version 0.4.5

## [0.4.5] - 2021-05-31 [YANKED]

### Added

- Send monitoring tests results to Cypress Dashboard

## [0.4.4] - 2021-05-28

### Changed

- Flaky tests that fail on Saturday to be skipped

## [0.4.3] - 2021-05-17

### Fixed

- Gift list second purchase tests that assert user name

## [0.4.2] - 2021-05-17

### Changed

- Second purchase mail now returns a random mail from a pool, so tests can be parallelized

## [0.4.1] - 2021-05-08

### Changed

- Disabled false positive tests

## [0.4.0] - 2021-03-24

### Added

- Expired credit card tests for other accounts than `vtexgame1`

### Changed

- Updated cypress version to 6.4.0
- Now failed tests retry by 2 times

### Removed

- Duplicated test scenarios

### Fixed

- Scenario names not corresponding to its specs

## [0.3.2] - 2020-10-27

### Fixed

- Tests for second purchase without geolocation and postal code.

## [0.3.1] - 2020-11-23

### Fixed

- Invoice address tests.

## [0.3.0] - 2020-10-27

### Added

- Tests for invalid invoice address scenarios.

## [0.2.10] - 2020-10-14

### Added

- Test for `shipping-preview` second purchase scenario.

## [0.2.9] - 2020-10-14

### Fixed

- Tests failing on stable
- Invoice tests not waiting for request before proceeding.

## [0.2.8] - 2020-08-18

### Fixed

- Flexible runtime context request query parameters.

## [0.2.7] - 2020-08-17

### Fixed

- Click on pickup buttons not working due to postal code input focus.

## [0.2.6] - 2020-08-14

### Removed

- The action which clicks on the calculate shipping button.

## [0.2.5] - 2020-06-26

### Changed

- Second purchase email to `second-purchase-5@mailinator.com`.

## [0.2.4] - 2020-06-05

### Changed

- Interval between tests from 30 minutes to 80 mintues.

### Removed

- Test on push workflow.

## [0.2.3] - 2020-06-05

### Changed

- Checkout UI stable tests are now sent to Monitoring's stable environment.

### Added

- Test for `shipping-preview` same price packages scenario.

## [0.2.2] - 2020-06-01

### Fixed

- Dockerfile for `beta-io` environment.

## [0.2.1] - 2020-06-01

### Fixed

- Wrong Dockerfiles causing tests not to run.

## [0.2.0] - 2020-06-01

### Changed

- Video of passing tests are deleted.
- All test results are sent to Monitoring's beta environment.
- Disabled Delivery + Scheduled Delivery and Delivery scenario.
- Fixed Cypress version at 4.6.0.

### Fixed

- Docker running tests on image creation.

## [0.1.4] - 2020-06-01

### Fixed

- Flaky Pickup + Unavailable Pickup + Delivery test.

## [0.1.3] - 2020-05-29

### Changed

- Tests now wait for the `getRuntimeContext` request to finish before starting.

### Fixed

- Pickup + Delivery scenario in vtexgame1invoice account.
- Tests failing due to them trying to type on a disabled element.

## [0.1.2] - 2020-04-01

### Added

- Test for errors while finishing a transaction.

## [0.1.1] - 2020-04-01

### Changed

- Switch documents between tests.

## [0.1.0] - 2020-03-27

### Added

- Tests for transaction apps scenarios.

### Changed

- Re-enable Boleto tests.

## [0.0.10] - 2020-02-27

### Added

- `orderFormId` to Monitoring results when a test fails.

### Changed

- Second purchase email
- Tests now wait a second before clicking the credit card tab

## [0.0.9] - 2020-02-11

## Fixed

- Invoice address filling

### Added

- Eslint

## [0.0.8] - 2020-02-05

### Added

- Pickup + Unavailable Pickup scenarios;
- Pickup + Unavailable Pickup + Delivery scenarios;
- Pickup + Unavailable Pickup + Unavailable Delivery scenarios.

### Changed

- Use meaningful names instead of sku numbers on tests

## [0.0.7] - 2020-01-07

### Added

- A scheduled delivery test where it's not mandatory

### Changed

- Test to use a product with mandatory scheduled delivery

### Added

- Workflow for VTEX IO `beta` workspace running in `stable` environment.
- Documentation for using cypress open;
- Ability to set `workspace` even if it's in `stable` environment;
- `.prettierrc`;
- Test for Delivery + Boleto + Without Geolocation and Postal Code.

### Changed

- Cron value to have less intersection.

## [0.0.6] - 2019-11-04

### Added

- Scheduled Delivery + Scheduled Pickup (First Purchase) tests.
- Delivery + Scheduled Delivery + Pickup e2e tests for first purchase.

## [0.0.5] - 2019-10-22

### Fixed

- Selection of credit card payment method.

### Added

- Gift list tests (Second Purchase).

### Changed

- Gift list from `xdescribe` to `describe` be actually used.

### Added

- Delivery + Scheduled Pickup tests (Second Purchase).

### Added

- Two cards payment e2e tests

### Changed

- Cypress docker verison

### Added

- FFMPEG video converting

### Added

- Delivery + Scheduled Pickup tests (First Purchase).

### Added

- `beta` and `stable` local headless testing

### Changed

- Method of uploading videos to S3 from lambda function to aws sdk with cognito credentials

### Changed

- Tests to cover all supported accountNames;
- Tests filenames to be more readable.

### Added

- test wrapper which generates tests for all supported accountNames;
- Second purchase tests;
- Delivery + Pickup tests (First and Second Purchase).

### Removed

- Tests which were previously manually tested.

## [0.0.4] - 2019-05-21

### Changed

- Pickup with no google maps pickup selection.

### Added

- Delivery With Lean Shipping disabled.

## [0.0.3] - 2019-05-16

### Added

- Credit card scenarios;
- Delivery with Geolocation scenario;
- Pickup without google maps scenario.

## [0.0.2] - 2019-04-10

### Added

- Util functions for e2e tests;
- `cypress` and `horus` for testing;
- Github templates.

### Updated

- End to end tests.

[unreleased]: https://github.com/vtex/checkout-ui-tests/compare/v0.12.1...HEAD
[0.5.13]: https://github.com/vtex/checkout-ui-tests/compare/v0.5.12...v0.5.13
[0.5.12]: https://github.com/vtex/checkout-ui-tests/compare/v0.5.11...v0.5.12
[0.8.17]: https://github.com/vtex/checkout-ui-tests/compare/v0.8.16...v0.8.17
[0.11.2]: https://github.com/vtex/checkout-ui-tests/compare/v0.11.1...v0.11.2
[0.11.1]: https://github.com/vtex/checkout-ui-tests/compare/v0.11.0...v0.11.1
[0.11.0]: https://github.com/vtex/checkout-ui-tests/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/vtex/checkout-ui-tests/compare/v0.9.2...v0.10.0
[0.9.2]: https://github.com/vtex/checkout-ui-tests/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/vtex/checkout-ui-tests/compare/v0.9.0...v0.9.1
[0.12.1]: https://github.com/vtex/checkout-ui-tests/compare/v0.12.0...v0.12.1
[0.12.0]: https://github.com/vtex/checkout-ui-tests/compare/v0.11.4...v0.12.0
[0.11.4]: https://github.com/vtex/checkout-ui-tests/compare/v0.11.3...v0.11.4
[unreleased]: https://github.com/vtex/checkout-ui-tests/compare/v0.16.0...HEAD
[0.19.1]: https://github.com/vtex/checkout-ui-tests/compare/v0.19.0...v0.19.1
[0.19.0]: https://github.com/vtex/checkout-ui-tests/compare/v0.18.0...v0.19.0
[0.18.0]: https://github.com/vtex/checkout-ui-tests/compare/v0.17.0...v0.18.0
[0.17.0]: https://github.com/vtex/checkout-ui-tests/compare/v0.16.0...v0.17.0
[0.16.0]: https://github.com/vtex/checkout-ui-tests/compare/v0.15.0...v0.16.0
[0.15.0]: https://github.com/vtex/checkout-ui-tests/compare/v0.14.0...v0.15.0
[0.14.0]: https://github.com/vtex/checkout-ui-tests/compare/v0.13.3...v0.14.0
[0.13.3]: https://github.com/vtex/checkout-ui-tests/compare/v0.13.2...v0.13.3
[0.13.2]: https://github.com/vtex/checkout-ui-tests/compare/v0.13.1...v0.13.2
[0.13.1]: https://github.com/vtex/checkout-ui-tests/compare/v0.13.0...v0.13.1
[unreleased]: https://github.com/vtex/checkout-ui-tests/compare/v0.17.0...HEAD
