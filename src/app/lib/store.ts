import type { CartItem, ProductItem } from '@/types/product';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const productItem = atomWithStorage<ProductItem | null>(
  'selectedProduct',
  null,
);

export const cartItems = atom<CartItem[]>([]);
