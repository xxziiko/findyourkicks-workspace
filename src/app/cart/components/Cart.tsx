'use client';

import dynamic from 'next/dynamic';
import { useCart } from '../hooks';
import type { CartListProps } from './CartList';

const CartView = dynamic(() => import('../ui/CartView'), { ssr: false });

export interface CartViewProps extends CartListProps {
  totalProduct: number;
  totalPrice: number;
  totalPriceWithDeliveryFee: number;
}

export default function Cart() {
  const {
    cartItems,
    checkedItems,
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    handleToggleAll,
    handleQuantityChange,
    handleDelete,
    handleToggle,
    handleProductInfo,
  } = useCart();

  const props = {
    cartItems,
    totalProduct,
    checkedItems,
    totalPrice,
    totalPriceWithDeliveryFee,
    onToggleAll: handleToggleAll,
    onQuantityChange: handleQuantityChange,
    onDelete: handleDelete,
    onToggle: handleToggle,
    onProductInfo: handleProductInfo,
  };

  return <CartView {...props} />;
}
