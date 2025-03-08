import type { CartItem, ProductItem } from '@/types/product';
import type { User } from '@supabase/supabase-js';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const productItem = atomWithStorage<ProductItem | null>(
  'selectedProduct',
  null,
);

export const cartItems = atomWithStorage<CartItem[]>('cart', []);

export const userAtom = atom<User | null>(null);
