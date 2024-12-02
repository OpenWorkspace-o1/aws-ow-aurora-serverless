import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsAuroraServerlessStackProps } from './AwsAuroraServerlessStackProps';

export class AwsAuroraServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsAuroraServerlessStackProps) {
    super(scope, id, props);
  }
}
