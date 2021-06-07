import type { AWS } from '@serverless/typescript'

import { authorizer } from '@/main/lambdas'

const serverlessConfiguration: AWS = {
  service: 'authorizer',
  frameworkVersion: '2',
  custom: {
    stage: "${opt:stage, self:provider.stage}"
  },
  plugins: [
    'serverless-offline',
    'serverless-plugin-typescript'
  ],
  provider: {
    name: 'aws',
    profile: 'dev',
    stage: 'dev',
    region: 'us-east-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { authorizer },
};

module.exports = serverlessConfiguration
