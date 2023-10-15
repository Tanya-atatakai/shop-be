import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
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
            bodyType: 'IProductsData'
          },
          '500': {
            description: 'Error response',
            bodyType: 'IErrorResponse'
          }
        }
      }
    }
  ]
};
