import type { CartItem, ProductItem } from '@/types/product';
import type { User } from '@supabase/supabase-js';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const productItemAtom = atomWithStorage<ProductItem | null>(
  'selectedProduct',
  null,
);

export const cartItemsAtom = atomWithStorage<CartItem[]>('cart', []);

export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
