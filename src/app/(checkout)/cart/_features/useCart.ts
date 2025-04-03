'use client';
import { useCheckBoxGroup } from '@/components/checkbox/useCheckboxGrop';
import { fetchCartItems } from '@/lib/api';
import { userIdAtom } from '@/lib/store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useDeleteCartMutation, useUpdateCartMutation } from '.';

export default function useCart() {
  const userId = useAtomValue(userIdAtom);
  const { data: cartItems } = useSuspenseQuery({
    queryKey: ['cart'],
    queryFn: async () => await fetchCartItems(userId),
    // FIXME: 임시로 캐시 무효화
    gcTime: 0,
  });

  const { checkedItems, handleToggleAll, handleDeleteItem, handleToggle } =
    useCheckBoxGroup(cartItems.map((item) => item?.cartItemId));

  const { mutate: mutateCartQuantity } = useUpdateCartMutation();
  const { mutate: mutateDeleteCartItem } = useDeleteCartMutation();

  const router = useRouter();

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

  const handleNextStep = () => {
    router.push('/checkout');
  };

  return {
    cartItems,
    checkedItems,
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    handleToggle,
    handleToggleAll,
    handleQuantityChange,
    handleDelete,
    handleNextStep,
  };
}
