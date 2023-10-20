import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'arn:aws:iam::974074737183:role/DynamoDbLambdaAccessRole',
  events: [
    {
      http: {
        method: 'get',
        path: '/products/{productId}',
        cors: true,
        summary: 'Get product by id',
        responses: {
          '200': {
            description: '200 response',
            bodyType: 'Product'
          },
          '404': {
            description: 'Product not found response',
            bodyType: 'NotFoundResponse'
          },
          '400': {
            description: 'Bad request response',
            bodyType: 'ErrorResponse'
          },
          '500': {
            description: '500 response',
            bodyType: 'ErrorResponse'
          }
        }
      }
    }
  ]
};
