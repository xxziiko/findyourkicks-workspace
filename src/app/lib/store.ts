import type { ProductItem } from '@/types/product';
import { atomWithStorage } from 'jotai/utils';

export const productItem = atomWithStorage<ProductItem | null>(
  'selectedProduct',
  null,
);
