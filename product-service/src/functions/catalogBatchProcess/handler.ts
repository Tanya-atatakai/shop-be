import { SQSEvent } from 'aws-lambda';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { addProductToDB, addStockToDB, getProductById } from '@libs/data-service';

const sns = new SNSClient({ region: process.env.REGION });

export const main = async (event: SQSEvent): Promise<void> => {
  try {
    console.log('Received SQS messages: ', JSON.stringify(event));

    const products = [];

    for (const record of event.Records) {
      const { body } = record;
      const productData = JSON.parse(body);

      if (productData && Object.keys(productData).length > 0) {
        const existingProduct = await getProductById(productData.id);

        if (!existingProduct) {
          const stock = { count: 0 };

          await addProductToDB(productData);
          await addStockToDB(productData.id, stock.count);

          products.push({ ...productData, ...stock });
        } else {
          // TODO: implement updating in DB
        }
      }
    }

    if (products.length > 0) {
      const formattedProducts = products.map((product) => {
        return `id: ${product.id}\ntitle: ${product.title}\n
        description: ${product.description}\n
        image URL: ${product.image}\n
        price: $${product.price}\n
        count: ${product.count}\n-------------------------------------`;
      });

      const message = formattedProducts.join('\n');

      const params = {
        Message: message,
        MessageAttributes: {
          updatedProducts: {
            DataType: 'String.Array',
            StringValue: JSON.stringify(products)
          }
        },
        Subject: 'New Products Created',
        TopicArn: process.env.SNS_ARN
      };

      const command = new PublishCommand(params);
      await sns.send(command);

      console.log('Sent event to SNS topic: New Products Created');
    }
  } catch (error) {
    console.log('Error processing SQS messages: ', error);
  }
};
