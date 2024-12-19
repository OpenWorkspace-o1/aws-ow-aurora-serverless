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