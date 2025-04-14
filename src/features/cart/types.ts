export type CartItem = {
  cartItemId: string;
  productId: string;
  title: string;
  image: string;
  selectedOption: {
    size: string;
    stock: number;
  };
  quantity: number;
  price: number;
  addedAt: string;
};

export interface CartItemPayload {
  product_id: string;
  size: string;
  quantity: number;
  price: number;
}

export type CartListPayload = CartItemPayload[];

export type CartList = CartItem[];
