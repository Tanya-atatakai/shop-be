import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
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
            bodyType: 'IProduct'
          },
          '404': {
            description: 'Product not found response',
            bodyType: 'INotFoundResponse'
          },
          '400': {
            description: 'Bad request response',
            bodyType: 'IErrorResponse'
          },
          '500': {
            description: '500 response',
            bodyType: 'IErrorResponse'
          }
        }
      }
    }
  ]
};
