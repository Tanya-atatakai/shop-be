import { APIGatewayProxyEventHandler } from '@libs/api-gateway';
import { formatJSONResponse, formatServerErrorResponse } from '../../../../shared/helpers/formatResponse';

import { getProducts } from '@libs/data-service';

export const main: APIGatewayProxyEventHandler = async () => {
  try {
    console.log('Request: products list');

    const data = await getProducts();

    console.log('Success: products list', { data });

    return formatJSONResponse({
      data
    });
  } catch (error) {
    console.log('Error: products list', { error });

    return formatServerErrorResponse();
  }
};
