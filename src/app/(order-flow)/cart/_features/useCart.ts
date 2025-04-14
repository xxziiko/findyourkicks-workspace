'use client';

import { useCheckBoxGroup } from '@/components/checkbox/useCheckboxGrop';
import { fetchCartList } from '@/features/cart/apis';
import type { CartList } from '@/features/cart/types';
import { userIdAtom } from '@/lib/store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { useDeleteCartMutation, useUpdateCartMutation } from '.';
import { useCreateOrderSheetMutation } from '../../_features';

export default function useCart() {
  const userId = useAtomValue(userIdAtom);
  const { data: cartItems } = useSuspenseQuery({
    queryKey: ['cart'],
    queryFn: async () => await fetchCartList(userId),
  });

  const {
    isAllChecked,
    checkedItems,
    handleToggleAll,
    handleDeleteItem,
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
      handleDeleteItem(cartItemId);
    },
    [mutateDeleteCartItem, handleDeleteItem],
  );

  const mapCartItemsToCheckoutRequest = (cartItems: CartList) => {
    return cartItems.map((item) => ({
      productId: item.productId,
      size: item.selectedOption.size,
      price: item.price,
      quantity: item.quantity,
      cartItemId: item.cartItemId,
    }));
  };

  const handleOrderSheet = () => {
    const filteredCart = cartItems.filter(
      (item) => checkedItems[item.cartItemId],
    );
    const body = mapCartItemsToCheckoutRequest(filteredCart);
    mutateCreateOrderSheet({ userId, body });
  };

  const handleOrderSheetForSingleProduct = (cartItemId: string) => {
    const filteredCart = cartItems.filter(
      (item) => item.cartItemId === cartItemId,
    );
    const body = mapCartItemsToCheckoutRequest(filteredCart);
    mutateCreateOrderSheet({ userId, body });
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
