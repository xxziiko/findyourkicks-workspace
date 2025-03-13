'use client';

import { useCart } from '../hooks';
import { CartView } from '../ui/index';
import type { CartListProps } from './CartList';

export interface CartViewProps extends CartListProps {
  totalProduct: number;
  totalPrice: number;
  totalPriceWithDeliveryFee: number;
}

export default function Cart() {
  const {
    items,
    checkedItems,
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    handleToggleAll,
    handleQuantityChange,
    handleDelete,
    handleToggle,
  } = useCart();

  const props = {
    items,
    handleToggleAll,
    handleQuantityChange,
    handleDelete,
    handleToggle,
    totalProduct,
    checkedItems,
    totalPrice,
    totalPriceWithDeliveryFee,
  };

  return <CartView {...props} />;
}
