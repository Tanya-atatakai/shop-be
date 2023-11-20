import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: {
          origins: ["*"],
        },
        authorizer: {
          name: "basicAuthorizer",
          arn: {
            "Fn::ImportValue": "BasicAuthorizerLambdaFunctionArn",
          },
        },
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
      },
    },
  ],
};
