import { Product, ProductsData, Stock } from 'src/types/api-types';
import {
  AttributeValue,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryInput,
  ScanCommand,
  ScanCommandInput
} from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDBClient({ region: process.env.REGION || 'us-east-1' });

function deserializeDynamoDBItem(item: Record<string, AttributeValue>) {
  const deserializedItem = {};
  for (const [attributeName, value] of Object.entries(item)) {
    const attributeType = Object.keys(value)[0];

    if (attributeType === 'S') {
      deserializedItem[attributeName] = value.S;
    } else if (attributeType === 'N') {
      deserializedItem[attributeName] = parseFloat(value.N);
    }
  }

  return deserializedItem;
}

async function queryProducts(): Promise<Product[]> {
  const params: ScanCommandInput = {
    TableName: process.env.PRODUCTS_TABLE_NAME || 'products'
  };

  const data = await dynamodb.send(new ScanCommand(params));

  return data.Items.map((item) => deserializeDynamoDBItem(item)) as Product[];
}

async function queryStock(productId: string): Promise<Stock> {
  const params: QueryInput = {
    TableName: process.env.STOCKS_TABLE_NAME || 'stocks',
    KeyConditionExpression: 'product_id = :id',
    ExpressionAttributeValues: {
      ':id': { S: productId }
    }
  };

  const data = await dynamodb.send(new QueryCommand(params));

  return deserializeDynamoDBItem(data.Items[0]) as Stock;
}

export const getProducts = async (): Promise<ProductsData> => {
  try {
    const products = await queryProducts();

    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const stock = await queryStock(product.id);

        return { ...product, count: (stock && stock.count) || 0 };
      })
    );

    return { products: productsWithStock };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProductById = async (productId): Promise<Product | undefined> => {
  const { products } = await getProducts();

  return products.find((product) => product.id === productId);
};

export const addProductToDB = async (id, title, description, image, price) => {
  const params: PutItemCommandInput = {
    TableName: process.env.PRODUCTS_TABLE_NAME || 'products',
    Item: {
      id: { S: id },
      title: { S: title },
      description: { S: description },
      image: { S: image },
      price: { N: price.toString() }
    }
  };

  const command = new PutItemCommand(params);

  try {
    await dynamodb.send(command);
    console.log('Product added successfully.');
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

export const addStockToDB = async (product_id, count) => {
  const params: PutItemCommandInput = {
    TableName: process.env.STOCKS_TABLE_NAME || 'stocks',
    Item: {
      product_id: { S: product_id },
      count: { N: count.toString() }
    }
  };

  const command = new PutItemCommand(params);

  try {
    await dynamodb.send(command);
    console.log('Stock added successfully.');
  } catch (error) {
    console.error('Error adding stock:', error);
  }
};
