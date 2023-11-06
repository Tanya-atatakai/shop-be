import type { AWS } from "@serverless/typescript";
import { importFileParser, importProductsFile } from "@functions";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-1",
    environment: {
      BUCKET: "${self:custom.bucket}",
      REGION: "${self:provider.region}",
      SQS_URL: {
        "Fn::ImportValue": "CatalogItemsQueueUrl",
      },
    },
    iam: {
      role: {
        managedPolicies: [
          "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
          "arn:aws:iam::aws:policy/AmazonSQSFullAccess",
          "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess",
        ],
        statements: [
          {
            Effect: "Allow",
            Action: ["s3:ListBucket"],
            Resource: "arn:aws:s3:::${self:custom.bucket}",
          },
          {
            Effect: "Allow",
            Action: ["s3:*"],
            Resource: "arn:aws:s3:::${self:custom.bucket}/*",
          },
        ],
      },
    },
  },
  package: { individually: true },
  custom: {
    bucket: "products-files-p4x9q7h2r1s0w",
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      S3Bucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:custom.bucket}",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ["GET", "PUT"],
                AllowedHeaders: ["*"],
                AllowedOrigins: ["*"],
              },
            ],
          },
        },
      },
      Default4xxErrors: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Request-Headers":
              "'Authorization'",
          },
          ResponseType: "DEFAULT_4XX",
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
        },
      },
    },
  },
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
