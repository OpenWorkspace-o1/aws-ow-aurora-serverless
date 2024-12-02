#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsAuroraServerlessStack } from '../lib/aws-aurora-serverless-stack';

const app = new cdk.App();
new AwsAuroraServerlessStack(app, 'AwsAuroraServerlessStack', {
});
