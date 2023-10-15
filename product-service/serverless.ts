import type { AWS } from '@serverless/typescript';

import { getProductsList, getProductsById } from '@functions';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
    }
  },
  // import the function via paths
  functions: { getProductsList, getProductsById },
  package: { individually: true },
  custom: {
    autoswagger: {
      title: 'Shop BE Swagger Docs',
      apiType: 'http',
      generateSwaggerOnDeploy: true,
      basePath: '/dev'
    },
    webpack: {
      excludeFiles: '**/*.test.ts'
    }
  }
};

module.exports = serverlessConfiguration;
