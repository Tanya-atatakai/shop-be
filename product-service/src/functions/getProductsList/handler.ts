import { APIGatewayProxyEventHandler, formatServerErrorResponse } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';

import { getProducts } from '@libs/data-service';

export const main: APIGatewayProxyEventHandler = async () => {
  try {
    const data = await getProducts();

    return formatJSONResponse({
      data
    });
  } catch {
    return formatServerErrorResponse();
  }
};
