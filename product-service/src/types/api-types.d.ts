export type IProduct = {
  id: string;
  title: string;
  image: string;
  price: number;
};

export type IProductsData = {
  products: IProduct[];
};

export type INotFoundResponse = {
  message: string;
};

export type IErrorResponse = {
  error: string;
};
