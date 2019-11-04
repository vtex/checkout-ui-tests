# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
