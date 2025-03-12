'use client';

import { cartItemsAtom } from '@/app/lib/store';
import type { CartItem, SizeHandler } from '@/types/product';
import { useAtomValue } from 'jotai';
import { CartView } from './index';

export type CartViewProps = {
  items: CartItem[];
  onDecrementButtonClick: SizeHandler;
  onIncrementButtonClick: SizeHandler;
};

export default function Cart() {
  const items = useAtomValue(cartItemsAtom);

  const props = {
    items,
    // onDecrementButtonClick,
    // onIncrementButtonClick,
  };

  return (
    <CartView
      {...props}
      //FIXME: 기능 추가 후 제거
      onIncrementButtonClick={() => {}}
      onDecrementButtonClick={() => {}}
    />
  );
}
