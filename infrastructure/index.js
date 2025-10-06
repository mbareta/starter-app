'use strict';

const aws = require('@pulumi/aws');
const awsx = require('@pulumi/awsx');
const pulumi = require('@pulumi/pulumi');
const studion = require('@studion/infra-code-blocks');

const config = new pulumi.Config();
const awsConfig = new pulumi.Config('aws');
const appAwsConfig = new pulumi.Config('appAws');
const ssmPrefix = appAwsConfig.require('ssmPrefix');

const PROJECT_NAME = config.require('projectName');
const domain = config.require('domain');

const region = awsConfig.require('region');
const hostedZoneId = appAwsConfig.require('hostedZoneId');

const stack = pulumi.getStack();
const isProd = stack === 'prod';
const dbInstanceClass = 'db.t3.micro';

const subnetSpecs = [{ type: awsx.ec2.SubnetType.Public, cidrMask: 24 }];

if (isProd) {
  subnetSpecs.push(
    { type: awsx.ec2.SubnetType.Private, cidrMask: 24 },
    { type: awsx.ec2.SubnetType.Isolated, cidrMask: 24 }
  );
}
const vpc = new awsx.ec2.Vpc(
  `${PROJECT_NAME}-vpc`,
  {
    numberOfAvailabilityZones: 2,
    enableDnsHostnames: true,
    natGateways: { strategy: 'None' },
    subnetStrategy: 'Auto',
    subnetSpecs
  }
);

const bucket = new aws.s3.Bucket(`${PROJECT_NAME}-uploads`);

const primaryDbParams = new aws.rds.ParameterGroup('primary-db-params', {
  family: 'postgres15',
  parameters: [{
    name: 'wal_keep_size', value: 1024 // size in MB
  }, {
    name: 'work_mem', value: 30000
  }]
});

const db = new studion.Database(`${PROJECT_NAME}-db`, {
  instanceClass: dbInstanceClass,
  dbName: 'starter-adobe',
  username: 'starter',
  vpcId: vpc.vpcId,
  isolatedSubnetIds: vpc.publicSubnetIds, // TODO isolated
  vpcCidrBlock: vpc.vpc.cidrBlock,
  parameterGroupName: primaryDbParams.name,
  engineVersion: '15.7'
});


const frontend = new studion.StaticSite(`${PROJECT_NAME}-frontend`, {
  domain,
  hostedZoneId
});

const cluster = new aws.ecs.Cluster(`${PROJECT_NAME}-cluster`, {
  name: `${PROJECT_NAME}-${stack}`
});

const getEnvironment = () => [
  { name: 'HOSTNAME', value: `api.${domain}` },
  { name: 'IP', value: '0.0.0.0' },
  { name: 'PORT', value: '3000' },
  { name: 'DATABASE_NAME', value: db.instance.dbName },
  { name: 'DATABASE_USER', value: db.instance.username },
  { name: 'DATABASE_HOST', value: db.instance.address },
  { name: 'DATABASE_PORT', value: db.instance.port.apply(val => String(val)) },
  { name: 'S3_BUCKET', value: bucket.bucket }
];

const getSecrets = () => {
  const arn = db.password.secret.arn;
  return aws.ssm.getParametersByPathOutput({
    path: ssmPrefix, withDecryption: false
  }).apply(data => {
    const values = data.names.map((name, index) => ({
      name: name.replace(ssmPrefix, '').replace('/', ''),
      valueFrom: data.arns[index]
    }));
    return values.concat({ name: 'DATABASE_PASSWORD', valueFrom: arn });
  });
};

const backend = new studion.WebServer(`${PROJECT_NAME}-api`, {
  vpcId: vpc.vpcId,
  publicSubnetIds: vpc.publicSubnetIds,
  vpcCidrBlock: vpc.vpc.cidrBlock,
  clusterId: cluster.id,
  clusterName: cluster.name,
  image: process.env.SERVER_IMAGE,
  port: 3000,
  domain: `api.${domain}`,
  hostedZoneId,
  autoscaling: { enabled: false },
  size: 'small',
  desiredCount: 1,
  healthCheckPath: '/healthcheck',
  environment: getEnvironment(),
  secrets: getSecrets()
});

const ssmConnect = new studion.Ec2SSMConnect(`${PROJECT_NAME}-ssm-connect`, {
  vpcId: vpc.vpcId,
  privateSubnetId: vpc.publicSubnetIds.apply(ids => ids[0]),
  vpcCidrBlock: vpc.vpc.cidrBlock
});

module.exports = {
  cloudfrontId: frontend.cloudfront.id,
  ec2InstanceId: ssmConnect?.ec2.id,
  frontendBucketName: frontend.bucket.bucket
};
