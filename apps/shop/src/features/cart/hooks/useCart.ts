'use client';

import { useDeleteCartMutation, useUpdateCartMutation } from '@/features/cart';
import { useCartQuery } from '@/features/cart/hooks/queries/useCartQuery';
import type { CartItem } from '@/features/cart/types';
import { useCreateOrderSheetMutation } from '@/features/order-sheet';
import { PATH } from '@/shared/constants/path';
import { useCheckBoxGroup } from '@/shared/hooks';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useCart() {
  const router = useRouter();
  const { data: cartItems } = useCartQuery();

  const {
    isAllChecked,
    checkedItems,
    handleToggleAll,
    handleDeleteItem: handleDeleteItemFromCheckBox,
    handleToggle,
  } = useCheckBoxGroup(cartItems.map((item) => item?.cartItemId));

  const { mutate: mutateCartQuantity } = useUpdateCartMutation();
  const { mutate: mutateDeleteCartItem } = useDeleteCartMutation();
  const { mutate: mutateCreateOrderSheet, isPending: isMutatingOrderSheet } =
    useCreateOrderSheetMutation();

  const totalProduct = Object.values(checkedItems).filter(
    (checkedItem) => !!checkedItem,
  ).length;

  const totalPrice = cartItems
    .filter((item) => checkedItems[item.cartItemId] ?? false)
    .reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

  const totalPriceWithDeliveryFee = totalProduct === 0 ? 0 : totalPrice + 3000;

  const handleQuantityChange = useCallback(
    (cartItemId: string, quantity: number) => {
      mutateCartQuantity({ cartItemId, quantity });
    },
    [mutateCartQuantity],
  );

  const handleDelete = useCallback(
    (cartItemId: string) => {
      mutateDeleteCartItem(cartItemId);
      handleDeleteItemFromCheckBox(cartItemId);
    },
    [mutateDeleteCartItem, handleDeleteItemFromCheckBox],
  );

  const createOrderSheetFrom = (filterFn: (item: CartItem) => boolean) => {
    const filteredCart = cartItems.filter(filterFn);
    const payload = filteredCart.map((item) => ({
      productId: item.productId,
      size: item.selectedOption.size,
      price: item.price,
      quantity: item.quantity,
      id: item.cartItemId,
    }));

    mutateCreateOrderSheet(payload, {
      onSuccess: (response: { orderSheetId: string }) => {
        router.push(`${PATH.checkout}/${response.orderSheetId}`);
      },
    });
  };

  const isCheckedItem = (item: CartItem) => !!checkedItems[item.cartItemId];

  const handleOrderSheet = () => {
    createOrderSheetFrom(isCheckedItem);
  };

  const handleOrderSheetForSingleProduct = (cartItemId: string) => {
    createOrderSheetFrom((item) => item.cartItemId === cartItemId);
  };

  return {
    isAllChecked,
    isMutatingOrderSheet,
    cartItems,
    checkedItems,
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    handleToggle,
    handleToggleAll,
    handleQuantityChange,
    handleDelete,
    handleOrderSheet,
    handleOrderSheetForSingleProduct,
  };
}
