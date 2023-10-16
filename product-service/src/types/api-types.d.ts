export type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
};

export type Stock = {
  product_id: string;
  count: number;
};

// TODO: replace serverless-auto-swagger plugin because Omit doesn't work
// https://github.com/completecoding/serverless-auto-swagger/issues/45
export type ProductFull = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  count: number;
};

export type ProductsData = {
  products: ProductFull[];
};

export type CreateProductParams = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
};

export type NotFoundResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};
