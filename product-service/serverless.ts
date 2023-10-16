import type { AWS } from '@serverless/typescript';

import { getProductsList, getProductsById, createProduct } from '@functions';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: '${self:provider.region}',
      PRODUCTS_TABLE_NAME: 'products', // DynamoDB Products Table Name
      STOCKS_TABLE_NAME: 'stocks' // DynamoDB Stocks Table Name
    }
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct },
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
