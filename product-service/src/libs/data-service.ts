import { CreateProductParams, Product, ProductFull, ProductsData, Stock } from 'src/types/api-types';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommandInput,
  PutCommand,
  QueryCommandInput,
  QueryCommand,
  BatchGetCommandInput,
  BatchGetCommand,
  ScanCommandInput,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.REGION || 'us-east-1' }));

async function queryProducts(): Promise<Product[]> {
  const params: ScanCommandInput = {
    TableName: process.env.PRODUCTS_TABLE_NAME || 'products'
  };

  const data = await dynamodb.send(new ScanCommand(params));

  return data.Items as Product[];
}

async function batchQueryStock(productIds: string[]): Promise<Stock[]> {
  const params: BatchGetCommandInput = {
    RequestItems: {
      [process.env.STOCKS_TABLE_NAME || 'stocks']: {
        Keys: productIds.map((productId) => ({
          product_id: productId
        }))
      }
    }
  };

  const data = await dynamodb.send(new BatchGetCommand(params));
  return data.Responses![process.env.STOCKS_TABLE_NAME || 'stocks'] as Stock[];
}

export const getProducts = async (): Promise<ProductsData> => {
  try {
    const products = await queryProducts();
    const productIds = products.map((product) => product.id);

    const stocks = await batchQueryStock(productIds);

    const productsWithStock = products.map((product) => {
      const stock = stocks.find((stock) => stock.product_id === product.id);
      return { ...product, count: (stock && stock.count) || 0 };
    });

    return { products: productsWithStock, total: productsWithStock.length };
  } catch (error) {
    throw error;
  }
};

async function queryProduct(productId: string): Promise<Product> {
  const params: QueryCommandInput = {
    TableName: process.env.PRODUCTS_TABLE_NAME || 'products',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': productId
    }
  };

  const data = await dynamodb.send(new QueryCommand(params));

  return data.Items[0] as Product;
}

async function queryStock(productId: string): Promise<Stock> {
  const params: QueryCommandInput = {
    TableName: process.env.STOCKS_TABLE_NAME || 'stocks',
    KeyConditionExpression: 'product_id = :id',
    ExpressionAttributeValues: {
      ':id': productId
    }
  };

  const data = await dynamodb.send(new QueryCommand(params));

  return data.Items[0] as Stock;
}

export const getProductById = async (productId): Promise<ProductFull | null> => {
  const product = await queryProduct(productId);
  const stock = await queryStock(productId);

  if (!product) {
    return null;
  }

  return { ...product, count: stock?.count || 0 };
};

export const addProductToDB = async (product: CreateProductParams) => {
  const { id, title, description, image, price } = product;

  const params: PutCommandInput = {
    TableName: process.env.PRODUCTS_TABLE_NAME || 'products',
    Item: {
      id,
      title,
      description,
      image,
      price: price.toString()
    }
  };

  const command = new PutCommand(params);

  try {
    await dynamodb.send(command);
    console.log('Product added successfully.');
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

export const addStockToDB = async (product_id, count) => {
  const params: PutCommandInput = {
    TableName: process.env.STOCKS_TABLE_NAME || 'stocks',
    Item: {
      product_id,
      count: count.toString()
    }
  };

  const command = new PutCommand(params);

  try {
    await dynamodb.send(command);
    console.log('Stock added successfully.');
  } catch (error) {
    console.error('Error adding stock:', error);
  }
};
