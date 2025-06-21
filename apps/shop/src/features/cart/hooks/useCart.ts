'use client';

import { useCartQuery } from '@/features/cart/hooks/queries/useCartQuery';
import { useCheckBoxGroup } from '@/shared/hooks';

export function useCart() {
  const { data: cartItems } = useCartQuery();
  const { checkedItems, ...rest } = useCheckBoxGroup(
    cartItems.map((item) => item?.cartItemId),
  );

  const totalProduct = Object.values(checkedItems).filter(
    (checkedItem) => !!checkedItem,
  ).length;

  const totalPrice = cartItems
    .filter((item) => checkedItems[item.cartItemId] ?? false)
    .reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

  const totalPriceWithDeliveryFee = totalProduct === 0 ? 0 : totalPrice + 3000;

  return {
    cartItems,
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    checkedItems,
    ...rest,
  };
}
