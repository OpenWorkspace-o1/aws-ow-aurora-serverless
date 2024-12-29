declare module NodeJS {
    interface ProcessEnv {
        [key: string]: string | undefined;
        CDK_DEPLOY_REGION: string;
        ENVIRONMENT: string;
        APP_NAME: string;
        VPC_ID: string;
        VPC_SUBNET_TYPE: string;
        VPC_PRIVATE_SUBNET_IDS: string;
        VPC_PRIVATE_SUBNET_AZS: string;
        VPC_PRIVATE_SUBNET_ROUTE_TABLE_IDS: string;
        RDS_USERNAME: string;
        RDS_PASSWORD: string;
        OWNER: string;
        SERVERLESS_V2_MAX_CAPACITY: number;
        SERVERLESS_V2_MIN_CAPACITY: number;
        AURORA_ENGINE: string;
        DEFAULT_DATABASE_NAME: string;
        STORAGE_TYPE: string;
    }
}
