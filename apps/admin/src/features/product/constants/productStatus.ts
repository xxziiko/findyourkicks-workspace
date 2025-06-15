import type { ProductStatus } from '../api';

export const PRODUCT_STATUS = [
  {
    id: 'all',
    title: '전체',
  },
  {
    id: 'pending',
    title: '판매 대기',
  },
  {
    id: 'selling',
    title: '판매 중',
  },
  {
    id: 'soldout',
    title: '품절',
  },
] as const;

export type Status = keyof ProductStatus;
