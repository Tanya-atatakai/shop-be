import {
  APIGatewayProxyEventHandler,
  formatBadRequestResponse,
  formatJSONResponse,
  formatNotFoundResponse,
  formatServerErrorResponse
} from '@libs/api-gateway';
import { getProductById } from '@libs/data-service';

export const main: APIGatewayProxyEventHandler = async (event) => {
  try {
    const productId = event.pathParameters.productId;

    console.log('Request: product by id', productId);

    if (!productId) {
      console.log('Bad request: product by id', productId);

      return formatBadRequestResponse('Bad Request: Missing productId parameter');
    }

    const data = await getProductById(productId);

    if (!data) {
      console.log('Product not found', productId);

      return formatNotFoundResponse('Product not found');
    }

    console.log('Success: product by id', data);

    return formatJSONResponse({
      data
    });
  } catch (error) {
    console.log('Error: product by id', { productId: event.pathParameters.productId }, error);

    return formatServerErrorResponse();
  }
};
