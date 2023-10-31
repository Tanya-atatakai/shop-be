import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { main } from './handler';
import { formatBadRequestResponse } from '../../../../shared/helpers/formatResponse';

// Mock the data-service module
jest.mock('@libs/data-service', () => ({
  getProducts: jest.fn(),
  addProductToDB: jest.fn(),
  addStockToDB: jest.fn()
}));

describe('createProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle valid input and create product', async () => {
    const validEvent = {
      body: JSON.stringify({
        title: 'title',
        description: 'description',
        image: 'image',
        price: 100
      })
    } as APIGatewayProxyEvent;

    const response = (await main(validEvent, null, null)) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
  });

  test('should handle invalid input and return 400 Bad Request', async () => {
    const invalidEvent = {
      body: JSON.stringify({
        description: 'Sample description',
        price: 29.99
      })
    } as APIGatewayProxyEvent;

    const response = (await main(invalidEvent, null, null)) as APIGatewayProxyResult;

    expect(response).toEqual(formatBadRequestResponse('Error: title, image are not provided'));
  });
});
