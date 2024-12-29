import { StackProps } from "aws-cdk-lib";
import { ClusterScailabilityType } from "aws-cdk-lib/aws-rds";
export interface AwsAuroraServerlessStackProps extends StackProps {
    readonly resourcePrefix: string;
    readonly deployRegion: string | undefined;
    readonly deployEnvironment: string;
    readonly appName: string;
    readonly vpcSubnetType: string;
    readonly owner: string;
    readonly vpcId: string;
    readonly vpcPrivateSubnetIds: string[];
    readonly vpcPrivateSubnetAzs: string[];
    readonly vpcPrivateSubnetRouteTableIds: string[];
    readonly auroraEngine: AuroraEngine;
    readonly serverlessV2MaxCapacity: number;
    readonly serverlessV2MinCapacity: number;
    readonly rdsUsername: string;
    readonly rdsPassword: string;
    readonly defaultDatabaseName: string;
    readonly storageType: StorageType;
    readonly monitoringInterval: number;
    readonly clusterScailabilityType: ClusterScailabilityType;
}

export enum AuroraEngine {
    AuroraPostgresql = "aurora-postgresql",
    AuroraMysql = "aurora-mysql",
}

export enum StorageType {
    AURORA = "aurora",
    AURORA_IOPT1 = "aurora-iopt1",
}
