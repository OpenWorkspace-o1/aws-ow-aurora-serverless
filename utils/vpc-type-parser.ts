import * as ec2 from 'aws-cdk-lib/aws-ec2';

/**
 * This function parses the VPC subnet type string and returns the corresponding ec2.SubnetType
 * @param subnetType string
 * @returns ec2.SubnetType
 */
export function parseVpcSubnetType(subnetType: string): ec2.SubnetType {
    switch (subnetType) {
        case 'PUBLIC':
            return ec2.SubnetType.PUBLIC;;
        case 'PRIVATE_ISOLATED':
            return ec2.SubnetType.PRIVATE_ISOLATED;
        case 'PRIVATE_WITH_EGRESS':
            return ec2.SubnetType.PRIVATE_WITH_EGRESS;
        default:
            throw new Error(`Invalid VPC subnet type: ${subnetType}`);
    }
}
