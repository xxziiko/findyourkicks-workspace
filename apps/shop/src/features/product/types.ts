export interface ProductDetail {
  productId: string;
  title: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  category: string;
  inventory: InventoryItem[];
}

export type Products = ProductItem[];

export interface ProductItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  brand: string;
  category: string;
}

export interface InventoryItem {
  size: string;
  stock: number;
}

export interface SelectedOption {
  size: string;
  quantity: number;
}
