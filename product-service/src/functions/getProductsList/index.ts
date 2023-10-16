import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'arn:aws:iam::974074737183:role/DynamoDbLambdaAccessRole',
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        summary: 'Get list of products',
        responses: {
          '200': {
            description: '200 response',
            bodyType: 'ProductsData'
          },
          '500': {
            description: 'Error response',
            bodyType: 'ErrorResponse'
          }
        }
      }
    }
  ]
};
