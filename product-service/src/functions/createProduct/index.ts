import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'arn:aws:iam::974074737183:role/DynamoDbLambdaAccessRole',
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        summary: 'Create product',
        request: {
          // TODO: replace serverless-auto-swagger plugin because it can't generate body
          // https://github.com/completecoding/serverless-auto-swagger/issues/102
          schemas: {
            'application/json': {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                image: { type: 'string' },
                price: { type: 'number' }
              },
              required: ['title', 'description', 'image', 'price']
            }
          }
        },
        responses: {
          '200': {
            description: 'Success response'
          },
          '400': {
            description: 'Invalid data response',
            bodyType: 'ErrorResponse'
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
