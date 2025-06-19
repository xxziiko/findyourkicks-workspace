'use client';

import {
  CartView,
  useCart,
  useDeleteCartMutation,
  useOrderSheetCreator,
  useUpdateCartMutation,
} from '@/features/cart';
import { PATH } from '@/shared/constants/path';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function Cart() {
  const router = useRouter();

  const {
    cartItems,
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    isAllChecked,
    checkedItems,
    handleToggleAll,
    handleDeleteItem,
    handleToggle,
  } = useCart();

  const {
    handleOrderSheet,
    handleOrderSheetForSingleProduct,
    isMutatingOrderSheet,
  } = useOrderSheetCreator({
    cartItems,
    checkedItems,
    onSuccess: (response) => {
      router.push(`${PATH.checkout}/${response.orderSheetId}`);
    },
  });

  const { mutate: mutateCartQuantity } = useUpdateCartMutation();
  const { mutate: mutateDeleteCartItem } = useDeleteCartMutation();

  const handleDelete = useCallback(
    (cartItemId: string) => {
      mutateDeleteCartItem(cartItemId);
      handleDeleteItem(cartItemId);
    },
    [mutateDeleteCartItem, handleDeleteItem],
  );

  const handleCartQuantityChange = useCallback(
    (cartItemId: string, quantity: number) => {
      mutateCartQuantity({ cartItemId, quantity });
    },
    [mutateCartQuantity],
  );

  const props = {
    isAllChecked,
    cartItems,
    isMutatingOrderSheet,
    totalProduct,
    checkedItems,
    totalPrice,
    handleDeleteItem,
    totalPriceWithDeliveryFee,
    handleToggleAll,
    handleCartQuantityChange,
    handleDelete,
    handleToggle,
    handleOrderSheet,
    handleOrderSheetForSingleProduct,
  };

  return <CartView {...props} />;
}
