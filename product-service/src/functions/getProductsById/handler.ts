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

    if (!productId) {
      return formatBadRequestResponse('Bad Request: Missing productId parameter');
    }

    const data = await getProductById(productId);

    if (!data) {
      return formatNotFoundResponse('Product not found');
    }

    return formatJSONResponse({
      data
    });
  } catch {
    return formatServerErrorResponse();
  }
};
