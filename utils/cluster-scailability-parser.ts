import { ClusterScalabilityType } from "aws-cdk-lib/aws-rds";

export const parseClusterScalabilityTypeFromEnv = (): ClusterScalabilityType => {
    const clusterScalabilityType = process.env.CLUSTER_SCALABILITY_TYPE;
    if (!clusterScalabilityType) {
        throw new Error('CLUSTER_SCALABILITY_TYPE is not set');
    }
    const clusterScalabilityTypeUpper = clusterScalabilityType.toUpperCase();
    const acceptedValues = [ClusterScalabilityType.STANDARD, ClusterScalabilityType.LIMITLESS];
    if (!acceptedValues.includes(clusterScalabilityTypeUpper as ClusterScalabilityType)) {
        throw new Error(`Invalid CLUSTER_SCALABILITY_TYPE value: ${clusterScalabilityType}. Must be one of: ${acceptedValues.join(', ')}`);
    }
    return clusterScalabilityTypeUpper as ClusterScalabilityType;
}
