import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as kms from 'aws-cdk-lib/aws-kms';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { AuroraClusterInstanceType, AuroraEngine, AuroraPort, AwsAuroraServerlessStackProps } from './AwsAuroraServerlessStackProps';
import { SecretValue } from 'aws-cdk-lib';
import { parseVpcSubnetType } from '../utils/vpc-type-parser';
import { SubnetSelection } from 'aws-cdk-lib/aws-ec2';

export class AwsAuroraServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsAuroraServerlessStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, `${props.resourcePrefix}-VPC-Imported`, {
      vpcId: props.vpcId,
    });
    const vpcSubnetType = parseVpcSubnetType(props.vpcSubnetType);

    // define subnetAttributes as an array of Record<string, string> with subnetId comes from props.vpcPrivateSubnetIds and availabilityZone comes from props.vpcPrivateSubnetAzs
    const subnetAttributes: Record<string, string>[] = props.vpcPrivateSubnetIds.map((subnetId, index) => {
      return {
        subnetId: subnetId,
        availabilityZone: props.vpcPrivateSubnetAzs[index],
        routeTableId: props.vpcPrivateSubnetRouteTableIds[index],
        type: vpcSubnetType,
      };
    });
    console.log('subnetAttributes:', JSON.stringify(subnetAttributes));

    // retrieve subnets from vpc
    const vpcPrivateISubnets: cdk.aws_ec2.ISubnet[] = subnetAttributes.map((subnetAttribute) => {
      return ec2.Subnet.fromSubnetAttributes(this, subnetAttribute.subnetId, {
        subnetId: subnetAttribute.subnetId,
        availabilityZone: subnetAttribute.availabilityZone,
        routeTableId: subnetAttribute.routeTableId,
      });
    });
    const vpcSubnetSelection: SubnetSelection = vpc.selectSubnets({
      subnets: vpcPrivateISubnets,
      availabilityZones: props.vpcPrivateSubnetAzs,
    });

    // Create subnet group for Aurora cluster
    const auroraSubnetGroup = new rds.SubnetGroup(this, `${props.resourcePrefix}-Aurora-Subnet-Group`, {
      vpc,
      description: 'Subnet group for Aurora Serverless cluster',
      vpcSubnets: vpcSubnetSelection,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const auroraKmsKey = new kms.Key(this, `${props.resourcePrefix}-Aurora-KMS-Key`, {
      enabled: true,
      enableKeyRotation: true,
      rotationPeriod: cdk.Duration.days(90),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      keyUsage: kms.KeyUsage.ENCRYPT_DECRYPT,
      keySpec: kms.KeySpec.SYMMETRIC_DEFAULT,
    });

    const auroraPort = props.auroraEngine === AuroraEngine.AuroraPostgresql ? AuroraPort.PostgreSQL : AuroraPort.MySQL;
    const auroraSecurityGroup = new ec2.SecurityGroup(this, `${props.resourcePrefix}-Aurora-Security-Group`, {
      vpc,
      allowAllOutbound: false,
      description: 'Security group for Aurora Serverless cluster',
    });
    auroraSecurityGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // create custom monitoring role instead of using AWS managed policy
    const auroraMonitoringRole = new cdk.aws_iam.Role(this, `${props.resourcePrefix}-Aurora-Monitoring-Role`, {
      assumedBy: new cdk.aws_iam.ServicePrincipal('monitoring.rds.amazonaws.com'),
      description: 'Role for RDS Enhanced Monitoring',
      inlinePolicies: {
        monitoringPolicy: new cdk.aws_iam.PolicyDocument({
          statements: [
            new cdk.aws_iam.PolicyStatement({
              actions: [
                'logs:CreateLogGroup',
                'logs:PutLogEvents',
                'logs:DescribeLogStreams',
                'logs:DescribeLogGroups',
                'cloudwatch:PutMetricData'
              ],
              resources: [
                `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/rds/*`,
                `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/rds/*:log-stream:*`,
                `arn:aws:cloudwatch:${this.region}:${this.account}:*`
              ],
            }),
          ],
        }),
      },
    });
    auroraMonitoringRole.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // add NagSuppressions for the AwsSolutions-IAM5 warning for monitoringRole
    NagSuppressions.addResourceSuppressions(auroraMonitoringRole, [
      {
        id: 'AwsSolutions-IAM5',
        reason: 'Custom monitoring role is used instead of AWS managed policy',
      },
    ]);

    const removalPolicy = props.deployEnvironment === 'production' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY;
    const auroraPostgresEngineVersion = props.clusterScalabilityType === rds.ClusterScalabilityType.LIMITLESS
      ? rds.AuroraPostgresEngineVersion.VER_16_8_LIMITLESS
      : rds.AuroraPostgresEngineVersion.VER_17_4;
    const auroraDatabaseCluster = new rds.DatabaseCluster(this, `${props.resourcePrefix}-aurora-serverless-cluster`, {
      engine: props.auroraEngine === AuroraEngine.AuroraPostgresql ?
        rds.DatabaseClusterEngine.auroraPostgres({ version: auroraPostgresEngineVersion }) :
        rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_09_0 }),
      vpc,
      vpcSubnets: vpcSubnetSelection,
      securityGroups: [auroraSecurityGroup],
      autoMinorVersionUpgrade: true,
      serverlessV2MaxCapacity: props.serverlessV2MaxCapacity,
      serverlessV2MinCapacity: props.serverlessV2MinCapacity,
      writer: rds.ClusterInstance.serverlessV2(AuroraClusterInstanceType.Writer),
      readers: [
        rds.ClusterInstance.serverlessV2(AuroraClusterInstanceType.Reader, {
          scaleWithWriter: true,
        }),
      ],
      storageEncrypted: true,
      storageEncryptionKey: auroraKmsKey,
      credentials: rds.Credentials.fromPassword(props.rdsUsername, SecretValue.unsafePlainText(props.rdsPassword)),
      removalPolicy,
      iamAuthentication: true,
      backup: {
        retention: cdk.Duration.days(14),
        preferredWindow: '03:00-04:00',
      },
      storageType: props.storageType,
      backtrackWindow: props.auroraEngine === AuroraEngine.AuroraMysql ? cdk.Duration.hours(24) : undefined,
      defaultDatabaseName: props.defaultDatabaseName,
      monitoringInterval: cdk.Duration.seconds(props.monitoringInterval),
      monitoringRole: auroraMonitoringRole,
      enableClusterLevelEnhancedMonitoring: props.deployEnvironment === 'production',
      clusterScalabilityType: props.clusterScalabilityType,
      instanceUpdateBehaviour: rds.InstanceUpdateBehaviour.ROLLING,
      port: auroraPort,
      subnetGroup: auroraSubnetGroup,
      deletionProtection: false,
    });

    // Add suppression for the deletion protection warning
    NagSuppressions.addResourceSuppressions(auroraDatabaseCluster, [
      {
        id: 'AwsSolutions-RDS10',
        reason: 'Deletion protection is intentionally disabled for development/testing purposes',
      },
    ]);

    // Add suppression for the default endpoint port warning
    NagSuppressions.addResourceSuppressions(auroraDatabaseCluster, [
      {
        id: 'AwsSolutions-RDS11',
        reason: 'AwsSolutions-RDS11: The RDS instance or Aurora DB cluster uses the default endpoint port.',
      },
    ]);

    // Add suppression for backtrack warning if using PostgreSQL
    if (props.auroraEngine === AuroraEngine.AuroraPostgresql) {
      NagSuppressions.addResourceSuppressions(auroraDatabaseCluster, [
        {
          id: 'AwsSolutions-RDS14',
          reason: 'Backtrack is not supported for Aurora PostgreSQL clusters',
        },
      ]);
    }

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
      value: auroraKmsKey.keyId,
      description: 'Aurora KMS Key ID',
      exportName: `${props.resourcePrefix}-Aurora-KMS-Key-ID`,
    });

    new cdk.CfnOutput(this, `${props.resourcePrefix}-Aurora-KMS-Key-ARN`, {
      value: auroraKmsKey.keyArn,
      description: 'Aurora KMS Key ARN',
      exportName: `${props.resourcePrefix}-Aurora-KMS-Key-ARN`,
    });

    new cdk.CfnOutput(this, `${props.resourcePrefix}-Aurora-Port`, {
      value: auroraPort.toString(),
      description: 'Aurora Port',
      exportName: `${props.resourcePrefix}-Aurora-Port`,
    });

    // export auroraDatabaseCluster arn
    new cdk.CfnOutput(this, `${props.resourcePrefix}-Aurora-Database-Cluster-ARN`, {
      value: auroraDatabaseCluster.clusterArn,
      description: 'Aurora Database Cluster ARN',
      exportName: `${props.resourcePrefix}-Aurora-Database-Cluster-ARN`,
    });
  }
}
