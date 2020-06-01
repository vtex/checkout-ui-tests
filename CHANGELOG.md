# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
