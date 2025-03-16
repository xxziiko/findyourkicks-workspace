'use client';

import dynamic from 'next/dynamic';
import useCart from './useCart';

const CartView = dynamic(() => import('./CartView'), { ssr: false });

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
