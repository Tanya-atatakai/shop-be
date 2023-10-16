import { productsData } from '../mocks/products';
import { randomUUID } from 'crypto';
import { addProductToDB, addStockToDB } from './data-service';

const fillTables = async () => {
  for (const product of productsData.products) {
    const productId = randomUUID();
    await addProductToDB(productId, product.title, product.description, product.image, product.price);
    await addStockToDB(productId, Math.floor(Math.random() * 100) + 1); // Random stock count between 1 and 100
  }
};

fillTables();
