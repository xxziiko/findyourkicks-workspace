'use client';

import dynamic from 'next/dynamic';
import { useCart } from './_features';

// TODO: 서버 구축 시 삭제
const CartView = dynamic(() => import('./_features/CartView'), { ssr: false });

export default function CartPage() {
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
