# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
