import { DBClusterStorageType } from "aws-cdk-lib/aws-rds";

export const parseStorageTypeFromEnv = (): DBClusterStorageType => {
    const storageType = process.env.STORAGE_TYPE;
    if (!storageType) {
        throw new Error('STORAGE_TYPE is not set');
    }
    const storageTypeUpper = storageType.toUpperCase();
    const acceptedValues = [DBClusterStorageType.AURORA, DBClusterStorageType.AURORA_IOPT1];
    if (!acceptedValues.includes(storageTypeUpper as DBClusterStorageType)) {
        throw new Error(`Invalid STORAGE_TYPE value: ${storageType}. Must be one of: ${acceptedValues.join(', ')}`);
    }
    return storageTypeUpper as DBClusterStorageType;
}
