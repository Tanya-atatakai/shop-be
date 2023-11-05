import { main } from './handler';
import { PublishCommand } from '@aws-sdk/client-sns';
import * as dataService from '@libs/data-service';
import { SQSEvent } from 'aws-lambda';

jest.mock('@aws-sdk/client-sns', () => {
  return {
    SNSClient: jest.fn(() => ({
      send: jest.fn()
    })),
    PublishCommand: jest.fn()
  };
});

jest.mock('@libs/data-service', () => ({
  getProductById: jest.fn(),
  addProductToDB: jest.fn(),
  addStockToDB: jest.fn()
}));

describe('main', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle SQS event and publish to SNS topic', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({ id: '1', name: 'Product 1' })
        }
      ]
    } as SQSEvent;

    (dataService.getProductById as jest.Mock).mockResolvedValue(null);
    (dataService.addProductToDB as jest.Mock).mockResolvedValue(undefined);
    (dataService.addStockToDB as jest.Mock).mockResolvedValue(undefined);

    await main(event);

    expect(dataService.getProductById).toHaveBeenCalledWith('1');
    expect(dataService.addProductToDB).toHaveBeenCalledWith({ id: '1', name: 'Product 1' });
    expect(dataService.addStockToDB).toHaveBeenCalledWith('1', 0);
    expect(PublishCommand).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should not add item to DB if already exists', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({ id: '1', name: 'Product 1' })
        }
      ]
    } as SQSEvent;

    (dataService.getProductById as jest.Mock).mockResolvedValue({ id: '1', name: 'Product 1' });

    await main(event);

    expect(dataService.addProductToDB).not.toHaveBeenCalled();
    expect(dataService.addStockToDB).not.toHaveBeenCalled();
    expect(PublishCommand).not.toHaveBeenCalled();
  });

  it('should handle error', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({ id: '1', name: 'Product 1' })
        }
      ]
    } as SQSEvent;

    (dataService.getProductById as jest.Mock).mockRejectedValue(new Error('Database error'));

    await main(event);

    expect(dataService.getProductById).toHaveBeenCalledWith('1');
    expect(dataService.addProductToDB).not.toHaveBeenCalled();
    expect(dataService.addStockToDB).not.toHaveBeenCalled();
    expect(PublishCommand).not.toHaveBeenCalled();
  });
});
