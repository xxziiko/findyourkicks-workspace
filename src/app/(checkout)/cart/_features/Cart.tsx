'use client';

import { CartView, useCart } from '@/app/(checkout)/cart/_features';

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
    handleNextStep,
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
    onNextStep: handleNextStep,
  };

  return <CartView {...props} />;
}
