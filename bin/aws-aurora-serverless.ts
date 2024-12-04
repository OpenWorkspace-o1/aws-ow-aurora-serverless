#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { checkEnvVariables } from '../utils/check-environment-variable';

import { ApplyTags } from '../utils/apply-tag';
import { Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import { AwsAuroraServerlessStack } from '../lib/aws-aurora-serverless-stack';
import { AuroraEngine, AwsAuroraServerlessStackProps } from '../lib/AwsAuroraServerlessStackProps';

dotenv.config(); // Load environment variables from .env file
const app = new cdk.App();

const appAspects = Aspects.of(app);

// check APP_NAME variable
checkEnvVariables('APP_NAME',
    'CDK_DEPLOY_REGION',
    'ENVIRONMENT',
    'VPC_SUBNET_TYPE',
    'OWNER',
    'VPC_ID',
    'AURORA_ENGINE',
    'SERVERLESS_V2_MAX_CAPACITY',
    'SERVERLESS_V2_MIN_CAPACITY',
    'RDS_USERNAME',
    'RDS_PASSWORD',
);

const { CDK_DEFAULT_ACCOUNT: account } = process.env;

const cdkRegion = process.env.CDK_DEPLOY_REGION;
const deployEnvironment = process.env.ENVIRONMENT!;

const appName = process.env.APP_NAME!;
const owner = process.env.OWNER!;

// check best practices based on AWS Solutions Security Matrix
appAspects.add(new AwsSolutionsChecks());

appAspects.add(new ApplyTags({
    environment: deployEnvironment as 'development' | 'staging' | 'production' | 'feature',
    project: appName,
    owner: owner,
}));

const stackProps: AwsAuroraServerlessStackProps = {
    resourcePrefix: `${appName}-${deployEnvironment}`,
    env: {
        region: cdkRegion,
        account,
    },
    deployRegion: cdkRegion,
    deployEnvironment,
    appName,
    vpcSubnetType: process.env.VPC_SUBNET_TYPE!,
    owner,
    vpcId: process.env.VPC_ID!,
    auroraEngine: process.env.AURORA_ENGINE as AuroraEngine,
    serverlessV2MaxCapacity: Number(process.env.SERVERLESS_V2_MAX_CAPACITY!),
    serverlessV2MinCapacity: Number(process.env.SERVERLESS_V2_MIN_CAPACITY!),
    rdsUsername: process.env.RDS_USERNAME!,
    rdsPassword: process.env.RDS_PASSWORD!,
};
new AwsAuroraServerlessStack(app, `AwsAuroraServerlessStack`, {
    ...stackProps,
    stackName: `${appName}-${deployEnvironment}-${cdkRegion}-AwsAuroraServerlessStack`,
    description: `AwsAuroraServerlessStack for ${appName} in ${cdkRegion} ${deployEnvironment}.`,
});

app.synth();
