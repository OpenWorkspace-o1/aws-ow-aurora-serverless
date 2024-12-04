import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { AuroraEngine, AwsAuroraServerlessStackProps } from './AwsAuroraServerlessStackProps';
import { SecretValue } from 'aws-cdk-lib';
import { parseVpcSubnetType } from '../utils/vpc-type-parser';

export class AwsAuroraServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsAuroraServerlessStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, `${props.resourcePrefix}-VPC-Imported`, {
      vpcId: props.vpcId,
    });

    const kmsKey = new kms.Key(this, `${props.resourcePrefix}-Aurora-KMS-Key`, {
      enableKeyRotation: true,
    });

    const auroraPort = props.auroraEngine === AuroraEngine.AuroraPostgresql ? 5432 : 3306;
    const auroraSecurityGroup = new ec2.SecurityGroup(this, `${props.resourcePrefix}-Aurora-Security-Group`, {
      vpc,
      allowAllOutbound: false,
      description: 'Security group for Aurora Serverless cluster',
    });

    const auroraDatabaseCluster = new rds.DatabaseCluster(this, `${props.resourcePrefix}-Aurora-Serverless`, {
      engine: props.auroraEngine === AuroraEngine.AuroraPostgresql ?
        rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_17_2 }) :
        rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_08_0 }),
      vpc,
      vpcSubnets: {
        subnetType: parseVpcSubnetType(props.vpcSubnetType),
      },
      securityGroups: [auroraSecurityGroup],
      autoMinorVersionUpgrade: true,
      serverlessV2MaxCapacity: props.serverlessV2MaxCapacity,
      serverlessV2MinCapacity: props.serverlessV2MinCapacity,
      writer: rds.ClusterInstance.serverlessV2('writer'),
      readers: [rds.ClusterInstance.serverlessV2('reader')],
      storageEncrypted: true,
      storageEncryptionKey: kmsKey,
      credentials: rds.Credentials.fromSecret(new secretsmanager.Secret(this, `${props.resourcePrefix}-db-credentials`, {
        secretStringValue: SecretValue.unsafePlainText(JSON.stringify({
          username: props.rdsUsername,
          password: props.rdsPassword
        })),
      })),
      backup: {
        retention: cdk.Duration.days(14),
        preferredWindow: '03:00-04:00'
      },
    });

    new cdk.CfnOutput(this, `${props.resourcePrefix}-Aurora-Endpoint`, {
      value: auroraDatabaseCluster.clusterEndpoint.hostname,
      description: 'Aurora Endpoint',
      exportName: `${props.resourcePrefix}-Aurora-Endpoint`,
    });

    new cdk.CfnOutput(this, `${props.resourcePrefix}-Aurora-ARN`, {
      value: auroraDatabaseCluster.clusterArn,
      description: 'Aurora ARN',
      exportName: `${props.resourcePrefix}-Aurora-ARN`,
    });

    new cdk.CfnOutput(this, `${props.resourcePrefix}-Aurora-Security-Group-ID`, {
      value: auroraSecurityGroup.securityGroupId,
      description: 'Aurora Security Group ID',
      exportName: `${props.resourcePrefix}-Aurora-Security-Group-ID`,
    });

    new cdk.CfnOutput(this, `${props.resourcePrefix}-Aurora-KMS-Key-ID`, {
      value: kmsKey.keyId,
      description: 'Aurora KMS Key ID',
      exportName: `${props.resourcePrefix}-Aurora-KMS-Key-ID`,
    });

    new cdk.CfnOutput(this, `${props.resourcePrefix}-Aurora-KMS-Key-ARN`, {
      value: kmsKey.keyArn,
      description: 'Aurora KMS Key ARN',
      exportName: `${props.resourcePrefix}-Aurora-KMS-Key-ARN`,
    });

    new cdk.CfnOutput(this, `${props.resourcePrefix}-Aurora-Port`, {
      value: auroraPort.toString(),
      description: 'Aurora Port',
      exportName: `${props.resourcePrefix}-Aurora-Port`,
    });
  }
}
