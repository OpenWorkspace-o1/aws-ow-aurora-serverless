# AWS Aurora Serverless CDK Project

This project provides an AWS CDK implementation for deploying an Aurora Serverless v2 cluster with either PostgreSQL or MySQL compatibility.

## Features

- Aurora Serverless v2 cluster deployment
- Support for both PostgreSQL and MySQL engines
- Automatic scaling configuration
- KMS encryption
- Security group management
- VPC integration
- Secret management for database credentials

## Prerequisites

1. **AWS CLI Installation & Configuration**

   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install

   # Configure AWS CLI
   aws configure
   ```

2. **Node.js Installation**

   ```bash
   # Using nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 22
   nvm use 22
   ```

3. **AWS CDK Installation**

   ```bash
   npm install -g aws-cdk
   cdk --version
   ```

## Project Setup

1. **Clone and Install Dependencies**

   ```bash
   git clone <repository-url>
   cd aws-aurora-serverless
   npm install
   ```

2. **Environment Configuration**

   ```bash
   # Copy example environment file
   cp .env.example .env

   # Edit .env file with your values
   nano .env
   ```

   Required environment variables:
   - `APP_NAME`: Application name
   - `CDK_DEPLOY_REGION`: AWS region for deployment
   - `ENVIRONMENT`: Deployment environment (development/staging/production)
   - `OWNER`: Owner tag value
   - `VPC_ID`: Target VPC ID
   - `VPC_SUBNET_TYPE`: PRIVATE_WITH_EGRESS, PRIVATE_ISOLATED, or PUBLIC
   - `AURORA_ENGINE`: aurora-postgresql or aurora-mysql
   - `SERVERLESS_V2_MAX_CAPACITY`: Maximum ACU capacity
   - `SERVERLESS_V2_MIN_CAPACITY`: Minimum ACU capacity
   - `RDS_USERNAME`: Database admin username
   - `RDS_PASSWORD`: Database admin password

## Deployment

1. **Bootstrap CDK (First time only)**

   ```bash
   cdk bootstrap aws://<account-number>/<region>
   ```

2. **Build the Project**

   ```bash
   npm run build
   ```

3. **Deploy the Stack**

   ```bash
   # Review changes
   cdk diff

   # Deploy
   cdk deploy
   ```

## Useful Commands

- `npm run build`   - Compile TypeScript to JavaScript
- `npm run watch`   - Watch for changes and compile
- `npm run test`    - Run the jest unit tests
- `cdk deploy`      - Deploy this stack to your default AWS account/region
- `cdk diff`        - Compare deployed stack with current state
- `cdk synth`       - Emit the synthesized CloudFormation template
- `cdk destroy`     - Destroy the deployed stack

## Security Considerations

- The stack uses KMS encryption for database storage
- Credentials are stored in AWS Secrets Manager
- Security groups are configured with minimal required access
- VPC subnet type can be configured based on security requirements

## Outputs

After deployment, the following information will be available in CloudFormation outputs:

- Aurora Cluster Endpoint
- Aurora Cluster ARN
- Security Group ID
- KMS Key ID and ARN
- Database Port
- Connection String

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
