import { APIGatewayProxyEvent } from 'aws-lambda';
import { main } from './handler';
import { formatServerErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import { getProducts } from '@libs/data-service';

// Mock the data-service module
jest.mock('@libs/data-service', () => ({
  getProducts: jest.fn()
}));

describe('getProductsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  it('should handle successful request', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' }
    ];
    (getProducts as jest.Mock).mockResolvedValue(mockProducts);

    const event = {} as APIGatewayProxyEvent;

    const response = await main(event, null, null);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(response).toEqual(formatJSONResponse({ data: mockProducts }));
  });

  it('should handle server error from data-service', async () => {
    (getProducts as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    const event = {} as APIGatewayProxyEvent;

    const response = await main(event, null, null);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(response).toEqual(formatServerErrorResponse());
  });
});
