'use client';

import { CartView, useCart } from '@/features/cart';

export default function Cart() {
  const {
    isAllChecked,
    isMutatingOrderSheet,
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
    isMutatingOrderSheet,
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
