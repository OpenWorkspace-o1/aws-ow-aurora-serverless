import { ClusterScalabilityType } from "aws-cdk-lib/aws-rds";

export const parseClusterScalabilityTypeFromEnv = (): ClusterScalabilityType => {
    const clusterScalabilityType = process.env.CLUSTER_SCALABILITY_TYPE;
    if (!clusterScalabilityType) {
        throw new Error('CLUSTER_SCALABILITY_TYPE is not set');
    }
    const clusterScalabilityTypeLower = clusterScalabilityType.toLowerCase();
    const acceptedValues = [ClusterScalabilityType.STANDARD.toString(), ClusterScalabilityType.LIMITLESS.toString()];
    if (!acceptedValues.includes(clusterScalabilityTypeLower)) {
        throw new Error(`Invalid CLUSTER_SCALABILITY_TYPE value: ${clusterScalabilityType}. Must be one of: ${acceptedValues.join(', ')}`);
    }
    return clusterScalabilityTypeLower === ClusterScalabilityType.STANDARD.toString() ? ClusterScalabilityType.STANDARD : ClusterScalabilityType.LIMITLESS;
}
