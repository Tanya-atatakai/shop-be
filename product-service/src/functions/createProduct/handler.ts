import {
  APIGatewayProxyEventHandler,
  formatBadRequestResponse,
  formatJSONResponse,
  formatServerErrorResponse
} from '@libs/api-gateway';
import { randomUUID } from 'crypto';
import { addProductToDB, addStockToDB, getProducts } from '@libs/data-service';
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
      await addProductToDB(productId, data.title, data.description, data.image, data.price);
      await addStockToDB(productId, 0);

      const products = await getProducts();

      console.log('Success: create product', { products });

      return formatJSONResponse({
        data: products
      });
    }
  } catch (error) {
    console.log('Error: create product', { body: event.body }, error);

    return formatServerErrorResponse();
  }
};
