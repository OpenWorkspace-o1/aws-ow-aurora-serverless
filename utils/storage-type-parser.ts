import { DBClusterStorageType } from "aws-cdk-lib/aws-rds";

export const parseStorageTypeFromEnv = (): DBClusterStorageType => {
    const storageType = process.env.STORAGE_TYPE;
    if (!storageType) {
        throw new Error('STORAGE_TYPE is not set');
    }
    const storageTypeLower = storageType.toLowerCase();
    const acceptedValues = [DBClusterStorageType.AURORA.toString(), DBClusterStorageType.AURORA_IOPT1.toString()];
    if (!acceptedValues.includes(storageTypeLower)) {
        throw new Error(`Invalid STORAGE_TYPE value: ${storageType}. Must be one of: ${acceptedValues.join(', ')}`);
    }
    return storageTypeLower === DBClusterStorageType.AURORA.toString() ? DBClusterStorageType.AURORA : DBClusterStorageType.AURORA_IOPT1;
}
