'use client';
import { useCheckBoxGroup } from '@/components/checkbox/useCheckboxGrop';
import { cartItemsAtom, productItemAtom } from '@/lib/store';
import type { CartItem } from '@/lib/types';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function useCart() {
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const setProductItem = useSetAtom(productItemAtom);

  const { checkedItems, handleToggleAll, handleDeleteItem, handleToggle } =
    useCheckBoxGroup(cartItems.map((item) => item.cartId));

  const router = useRouter();

  const totalProduct = Object.values(checkedItems).filter(
    (checkedItem) => !!checkedItem,
  ).length;

  const totalPrice = cartItems
    .filter((item) => checkedItems[item.cartId] ?? false)
    .reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

  const totalPriceWithDeliveryFee = totalProduct === 0 ? 0 : totalPrice + 3000;

  const handleQuantityChange = useCallback(
    (id: string, quantity: number) => {
      if (quantity > 0 && quantity <= 3) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.cartId === id ? { ...item, quantity: quantity } : item,
          ),
        );
      }
    },
    [setCartItems],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setCartItems((prev) => prev.filter((item) => item.cartId !== id));
      handleDeleteItem(id);
    },
    [setCartItems, handleDeleteItem],
  );

  const handleProductInfo = useCallback(
    (item: CartItem) => {
      setProductItem(item);
      router.push(`/product/${item.productId}`);
    },
    [setProductItem, router],
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
    handleProductInfo,
    handleNextStep,
  };
}
