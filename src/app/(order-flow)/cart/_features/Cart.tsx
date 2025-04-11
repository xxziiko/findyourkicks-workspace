'use client';

import { CartView, useCart } from '@/app/(order-flow)/cart/_features';

export default function Cart() {
  const {
    isAllChecked,
    cartItems,
    checkedItems,
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    handleToggleAll,
    handleQuantityChange,
    handleDelete,
    handleToggle,
    handleOrderSheet,
    handleOrderSheetForSingleProduct,
  } = useCart();

  const props = {
    isAllChecked,
    cartItems,
    totalProduct,
    checkedItems,
    totalPrice,
    totalPriceWithDeliveryFee,
    onToggleAll: handleToggleAll,
    onQuantityChange: handleQuantityChange,
    onDelete: handleDelete,
    onToggle: handleToggle,
    onCreateOrderSheet: handleOrderSheet,
    onCreateOrderSheetForSingleProduct: handleOrderSheetForSingleProduct,
  };

  return <CartView {...props} />;
}
