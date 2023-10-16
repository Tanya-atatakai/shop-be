import { APIGatewayProxyEvent } from 'aws-lambda';
import { main } from './handler';
import {
  formatBadRequestResponse,
  formatJSONResponse,
  formatNotFoundResponse,
  formatServerErrorResponse
} from '@libs/api-gateway';
import { getProductById } from '@libs/data-service';

// Mock the data-service module
jest.mock('@libs/data-service', () => ({
  getProductById: jest.fn()
}));

describe('getProductsById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  it('should handle valid product ID', async () => {
    const event = {
      pathParameters: {
        productId: 'validProductId'
      }
    } as unknown as APIGatewayProxyEvent;

    const productData = { id: 'validProductId', name: 'Product Name' };
    (getProductById as jest.Mock).mockResolvedValue(productData);

    const response = await main(event, null, null);

    expect(getProductById).toHaveBeenCalledWith('validProductId');
    expect(response).toEqual(formatJSONResponse({ data: productData }));
  });

  it('should handle missing product ID', async () => {
    const event = {
      pathParameters: {}
    } as unknown as APIGatewayProxyEvent;

    const response = await main(event, null, null);

    expect(getProductById).not.toHaveBeenCalled();
    expect(response).toEqual(formatBadRequestResponse('Bad Request: Missing productId parameter'));
  });

  it('should handle product not found', async () => {
    const event = {
      pathParameters: {
        productId: 'nonExistentProductId'
      }
    } as unknown as APIGatewayProxyEvent;

    (getProductById as jest.Mock).mockResolvedValue(null);

    const response = await main(event, null, null);

    expect(getProductById).toHaveBeenCalledWith('nonExistentProductId');
    expect(response).toEqual(formatNotFoundResponse('Product not found'));
  });

  it('should handle server error', async () => {
    const event = {
      pathParameters: {
        productId: 'validProductId'
      }
    } as unknown as APIGatewayProxyEvent;

    (getProductById as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    const response = await main(event, null, null);

    expect(getProductById).toHaveBeenCalledWith('validProductId');
    expect(response).toEqual(formatServerErrorResponse());
  });
});
