export type CartLine = {
  productId: string;
  title: string;
  image: string;
  price: number;
  salePrice: number;
  finalPrice: number;
  totalStock: number;
  quantity: number;
  lineTotal: number;
};

export type Cart = {
  items: CartLine[];
  totalQuantity: number;
  subtotal: number;
};

export type CartResponse = { cart: Cart };

export type AddToCartInput = { productId: string; quantity: number };
