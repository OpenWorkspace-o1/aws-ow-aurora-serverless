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