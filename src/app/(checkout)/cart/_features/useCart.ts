'use client';
import { SIZE_INVENTORY } from '@/lib/constants';
import { cartItemsAtom, productItemAtom } from '@/lib/store';
import type { CartItem } from '@/lib/types';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export default function useCart() {
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const setProductItem = useSetAtom(productItemAtom);
  const [checkedItems, setCheckedItems] = useState<{
    [cartId: string]: boolean;
  }>(Object.fromEntries(cartItems.map((item) => [item.cartId, true])));

  const router = useRouter();

  const totalProduct = Object.values(checkedItems).filter(
    (checkedItem) => !!checkedItem,
  ).length;

  const totalPrice = cartItems
    .filter((item) => checkedItems[item.cartId] ?? false)
    .reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

  const totalPriceWithDeliveryFee = totalProduct === 0 ? 0 : totalPrice + 3000;

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setCheckedItems(
      Object.fromEntries(cartItems.map((item) => [item.cartId, checked])),
    );
  };

  const handleToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, cartId: string) => {
      const checked = e.target.checked;
      setCheckedItems((prev) => ({ ...prev, [cartId]: checked }));
    },
    [],
  );

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
      setCheckedItems((prev) => ({ ...prev, [id]: false }));
    },
    [setCartItems],
  );

  const handleProductInfo = useCallback(
    (item: CartItem) => {
      setProductItem(item);
      router.push(`/product/${item.productId}`);
    },
    [setProductItem, router],
  );

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
  };
}
