import { productsData } from '@mocks/products';
import { IProduct, IProductsData } from 'src/types/api-types';

export const getProducts = async (): Promise<IProductsData> => {
  return Promise.resolve(productsData);
};

export const getProductById = async (productId): Promise<IProduct | undefined> => {
  return productsData.products.find((product) => product.id === productId);
};
