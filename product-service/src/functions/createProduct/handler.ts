import {
  APIGatewayProxyEventHandler,
  formatBadRequestResponse,
  formatJSONResponse,
  formatServerErrorResponse
} from '@libs/api-gateway';
import { randomUUID } from 'crypto';
import { addProductToDB, addStockToDB } from '@libs/data-service';
import { CreateProductParams } from 'src/types/api-types';

const validateParams = (data: CreateProductParams) => {
  const requiredFields: (keyof CreateProductParams)[] = ['title', 'description', 'image', 'price'];
  const missingFields = requiredFields.filter((field) => !(field in data));

  if (missingFields.length > 0) {
    const errorFields = missingFields.join(', ');

    const error = `Error: ${errorFields} ${missingFields.length > 1 ? 'are' : 'is'} not provided`;

    return error;
  } else {
    return null;
  }
};

export const main: APIGatewayProxyEventHandler = async (event) => {
  try {
    const productId = randomUUID();

    const data = JSON.parse(event.body || '{}') as unknown as CreateProductParams;

    console.log('Request: create product', { data });

    const validationError = validateParams(data);

    if (validationError) {
      console.log('Bad request: create product', { validationError, data });

      return formatBadRequestResponse(validationError);
    } else {
      const { title, description, image, price } = data;
      const product = { id: productId, title, description, image, price };
      const stock = { count: 0 };

      await addProductToDB(product);
      await addStockToDB(productId, stock.count);

      console.log('Success: create product', { ...product, ...stock });

      return formatJSONResponse({
        data: null
      });
    }
  } catch (error) {
    console.log('Error: create product', { body: event.body }, error);

    return formatServerErrorResponse();
  }
};
