'use client';
import { useCheckBoxGroup } from '@/components/checkbox/useCheckboxGrop';
import { fetchCartItems } from '@/lib/api';
import { userIdAtom } from '@/lib/store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function useCart() {
  const userId = useAtomValue(userIdAtom);
  const { data: cartItems } = useSuspenseQuery({
    queryKey: ['cart'],
    queryFn: () => fetchCartItems(userId),
    staleTime: 60,
  });

  const { checkedItems, handleToggleAll, handleDeleteItem, handleToggle } =
    useCheckBoxGroup(cartItems.map((item) => item?.cartItemId));

  const router = useRouter();

  const totalProduct = Object.values(checkedItems).filter(
    (checkedItem) => !!checkedItem,
  ).length;

  const totalPrice = cartItems
    .filter((item) => checkedItems[item.cartItemId] ?? false)
    .reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

  const totalPriceWithDeliveryFee = totalProduct === 0 ? 0 : totalPrice + 3000;

  const handleQuantityChange = useCallback((id: string, quantity: number) => {
    // if (quantity > 0 && quantity <= 3) {
    //   setCartItems((prev) =>
    //     prev.map((item) =>
    //       item.cartItemId === id ? { ...item, quantity: quantity } : item,
    //     ),
    //   );
    // }
  }, []);

  const handleDelete = useCallback((id: string) => {
    // setCartItems((prev) => prev.filter((item) => item.cartItemId !== id));
    // handleDeleteItem(id);
  }, []);

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
