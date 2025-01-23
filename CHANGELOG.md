## 2025-01-23 [PR#55](https://github.com/OpenWorkspace-o1/aws-aurora-serverless/pull/55)

### Changed

- Updated `@types/node` from `22.10.7` to `22.10.8`.
- Updated `cdk-nag` from `^2.34.23` to `^2.34.24`.
- Bumped project version from `0.1.6` to `0.1.7`.

## 2025-01-20 [PR#53](https://github.com/OpenWorkspace-o1/aws-aurora-serverless/pull/53)

### Changed

- Disabled `deletionProtection` for the Aurora Serverless database cluster.

### Added

- Added suppression for the `AwsSolutions-RDS10` warning to justify the change.

## 2025-01-18 [PR#51](https://github.com/OpenWorkspace-o1/aws-aurora-serverless/pull/51)

### Added

- Added `auroraSubnetGroup` for Aurora cluster with `RemovalPolicy.DESTROY`.
- Enabled `deletionProtection` and `enableClusterLevelEnhancedMonitoring` for production environments.

### Changed

- Renamed `monitoringRole` to `auroraMonitoringRole` and applied `RemovalPolicy.DESTROY`.

### Removed

- Removed connection string export for security reasons.

## 2025-01-17 [PR#47](https://github.com/OpenWorkspace-o1/aws-aurora-serverless/pull/47)

### Changed

- Updated stack naming convention in `AwsAuroraServerlessStack` to include `owner` and `deployEnvironment`.

### Added

- Added `instanceUpdateBehaviour` with value `ROLLING` to the Aurora database cluster configuration.

## 2025-01-16 [PR#43](https://github.com/OpenWorkspace-o1/aws-aurora-serverless/pull/43)

### Changed

- Updated KMS key rotation period from `30` to `90` days.
- Changed `MONITORING_INTERVAL` unit from minutes to seconds.
- Improved parsing logic for `STORAGE_TYPE` and `CLUSTER_SCALABILITY_TYPE` to use lowercase comparison.

### Removed

- Removed `cloudwatchLogsExports` from Aurora database cluster configuration.

## 2025-01-16 [PR#41](https://github.com/OpenWorkspace-o1/aws-aurora-serverless/pull/41)

### Fixed

- Fixed typo in function name `parseClusterScailabilityTypeFromEnv` to `parseClusterScalabilityTypeFromEnv`.

### Added

- Added `parseClusterScalabilityTypeFromEnv` function to validate `CLUSTER_SCALABILITY_TYPE` environment variable.

### Changed

- Updated `clusterScailabilityType` property to `clusterScalabilityType` in `AwsAuroraServerlessStackProps`.

## 2025-01-11 [PR#37](https://github.com/OpenWorkspace-o1/aws-aurora-serverless/pull/37)

### Changed

- Replaced custom `StorageType` enum with `DBClusterStorageType` for improved consistency and simplicity.
- Simplified `parseStorageTypeFromEnv` to directly use `DBClusterStorageType`.
- Updated `AwsAuroraServerlessStackProps` to utilize `DBClusterStorageType`.

### Updated

- Updated `aws-cdk` and `aws-cdk-lib` dependencies from `2.175.0` to `2.175.1`.
- Incremented project version from `0.1.4` to `0.1.5` in `package.json`.

## 2025-01-10 [PR#35](https://github.com/OpenWorkspace-o1/aws-aurora-serverless/pull/35)

### Updated

- Updated `aws-cdk` and `aws-cdk-lib` dependencies from `2.173.4` to `2.175.0`.
- Bumped `@types/node` dependency version from `22.10.2` to `22.10.5`.

### Changed

- Incremented project version from `0.1.3` to `0.1.4` in `package.json`.

## 2024-12-31 [PR#33](https://github.com/OpenWorkspace-o1/aws-aurora-serverless/pull/33)

### Changed
- Enabled automatic KMS key rotation every 30 days
- Explicitly enabled KMS key with `enabled: true` property
- Reordered KMS key configuration properties for improved clarity and consistency

## 2024-12-29 [*][https://github.com/OpenWorkspace-o1/aws-aurora-serverless/pull/26]

### Added
- Introduced configurable `STORAGE_TYPE` property for Aurora clusters
  * Added support for `AURORA` and `AURORA_IOPT1` storage types
  * Implemented utility functions for storage type parsing and validation
- Added `monitoringInterval` configuration for enhanced CloudWatch monitoring
- Updated environment configuration to include `STORAGE_TYPE` and `MONITORING_INTERVAL`

### Changed
- Enhanced `AwsAuroraServerlessStack` to utilize new storage type configuration
- Updated `.env.example` and `process-env.d.ts` to support new configuration options

## 2024-12-29 [*][https://github.com/OpenWorkspace-o1/aws-aurora-serverless/pull/24]

### Updated
- Updated `aws-cdk` from `2.173.2` to `2.173.4` in `devDependencies` and `peerDependencies`
- Updated `aws-cdk-lib` from `2.173.2` to `2.173.4` in `dependencies` and `peerDependencies`
- Incremented project version from `0.1.2` to `0.1.3

## 2024-12-19

### Added
- Support for specifying a default database name in Aurora Serverless stack
  * New environment variable `DEFAULT_DATABASE_NAME`
  * Updated `AwsAuroraServerlessStackProps` interface to include `defaultDatabaseName` property

### Changed
- Updated `.env.example` with `OWNER` value to `OpenWorkspace-o1`
- Modified Aurora Serverless stack to utilize the new `defaultDatabaseName` configuration

## 2024-12-14

### Added
- New environment variables for AWS Aurora Serverless VPC subnet configuration:
  * `VPC_PRIVATE_SUBNET_IDS`
  * `VPC_PRIVATE_SUBNET_AZS`
  * `VPC_PRIVATE_SUBNET_ROUTE_TABLE_IDS`

### Changed
- Enhanced VPC subnet selection process for Aurora Serverless
  * Dynamically retrieve and select subnets using provided subnet IDs and availability zones
  * Improved flexibility in VPC subnet configuration
- Updated type definitions to support new subnet-related parameters in CDK stack

## 2024-12-07

### Changed
- Updated Aurora Serverless PostgreSQL engine version from `VER_17_2` to `VER_16_6`
- Maintained existing database cluster engine configuration and conditional removal policy
- Preserved environment-specific database cluster management approach

## 2024-12-07

### Changed
- Updated `APP_NAME` in `.env.example` from `aws-aurora-serverless` to `ow-aurora-serverless`

### Added
- Enhanced environment variable definitions in `process-env.d.ts`
  - Added `VPC_SUBNET_TYPE`, `RDS_USERNAME`, and `RDS_PASSWORD` to `ProcessEnv` interface

## 2024-12-07

### Changed
- Implemented dynamic `removalPolicy` for Aurora Serverless database cluster based on deployment environment
  - `RETAIN` for production
  - `DESTROY` for non-production environments
- Simplified removal policy configuration by directly setting policy during cluster creation
- Removed redundant `applyRemovalPolicy` method call

## 2024-12-07

### Changed
- Updated AWS CDK dependencies to version `2.172.0`
- Enhanced Aurora Serverless configuration with improved scalability and reliability
- Simplified RDS credentials management
- Configured dynamic removal policy based on deployment environment

### Added
- Enabled IAM authentication for the database cluster
- Added support for Aurora backtrack for MySQL engines
- Included `cdk-nag` suppressions for AWS solution warnings

### Updated
- Improved `.env.example` with more flexible configuration options
- Optimized serverless reader instances with `scaleWithWriter: true