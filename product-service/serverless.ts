import type { AWS } from '@serverless/typescript';

import { getProductsList, getProductsById, createProduct, catalogBatchProcess } from '@functions';

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
      STOCKS_TABLE_NAME: 'stocks', // DynamoDB Stocks Table Name,
      SNS_ARN: {
        Ref: 'CreateProductTopic'
      }
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['sqs:*'],
            Resource: {
              'Fn::GetAtt': ['CatalogItemsQueue', 'Arn']
            }
          },
          {
            Effect: 'Allow',
            Action: ['sns:*'],
            Resource: {
              Ref: 'CreateProductTopic'
            }
          }
        ],
        managedPolicies: ['arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess']
      }
    }
  },
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
  },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'CatalogItemsQueue'
        }
      },
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'CreateProductTopic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'tatiana_priemova@epam.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'CreateProductTopic'
          }
        }
      },
      SNSSubscriptionTestFiltered: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'densatsu@mail.ru',
          Protocol: 'email',
          TopicArn: {
            Ref: 'CreateProductTopic'
          },
          FilterPolicyScope: 'MessageAttributes',
          FilterPolicy: {
            isTest: ['true']
          }
        }
      }
    },
    Outputs: {
      CatalogItemsQueueUrl: {
        Value: {
          Ref: 'CatalogItemsQueue'
        },
        Export: {
          Name: 'CatalogItemsQueueUrl'
        }
      }
    }
  },

  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess }
};

module.exports = serverlessConfiguration;
