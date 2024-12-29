import { ClusterScailabilityType } from "aws-cdk-lib/aws-rds";

export const parseClusterScailabilityTypeFromEnv = (): ClusterScailabilityType => {
    const clusterScailabilityType = process.env.CLUSTER_SCALABILITY_TYPE;
    if (!clusterScailabilityType) {
        throw new Error('CLUSTER_SCALABILITY_TYPE is not set');
    }
    const clusterScailabilityTypeUpper = clusterScailabilityType.toUpperCase();
    const acceptedValues = [ClusterScailabilityType.STANDARD, ClusterScailabilityType.LIMITLESS];
    if (!acceptedValues.includes(clusterScailabilityTypeUpper as ClusterScailabilityType)) {
        throw new Error(`Invalid CLUSTER_SCALABILITY_TYPE value: ${clusterScailabilityType}. Must be one of: ${acceptedValues.join(', ')}`);
    }
    return clusterScailabilityTypeUpper as ClusterScailabilityType;
}
