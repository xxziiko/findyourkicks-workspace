import type { RatingSummary } from '@/features/review/types';

export interface ProductDetail {
  productId: string;
  title: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  category: string;
  inventory: InventoryItem[];
  rating?: RatingSummary;
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

export type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'popular';

export interface ProductFilters {
  q?: string;
  brand?: string[];
  category?: string[];
  size?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
}

export interface FilterOption {
  id: string;
  name: string;
}

export interface FilterOptions {
  brands: FilterOption[];
  categories: FilterOption[];
  sizes: string[];
}
