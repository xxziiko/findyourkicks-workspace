import { cartItemsAtom } from '@/app/lib/store';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';

export default function useCart() {
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [checkedItems, setCheckedItems] = useState<{
    [cartId: string]: boolean;
  }>(Object.fromEntries(cartItems.map((item) => [item.cartId, true])));

  const totalProduct = Object.values(checkedItems).filter(
    (checkedItem) => !!checkedItem,
  ).length;

  const totalPrice = cartItems
    .filter((item) => checkedItems[item.cartId] ?? false)
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  const totalPriceWithDeliveryFee = totalProduct === 0 ? 0 : totalPrice + 3000;

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setCheckedItems(
      Object.fromEntries(cartItems.map((item) => [item.cartId, checked])),
    );
  };

  const handleToggle = useCallback(
    (cartId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setCheckedItems((prev) => ({ ...prev, [cartId]: checked }));
    },
    [],
  );

  const handleQuantityChange = useCallback(
    (cartId: string, quantity: number) => () => {
      if (quantity > 0) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.cartId === cartId ? { ...item, quantity: quantity } : item,
          ),
        );
      }
    },
    [setCartItems],
  );

  const handleDelete = useCallback(
    (cartId: string) => () => {
      setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
      setCheckedItems((prev) => ({ ...prev, [cartId]: false }));
    },
    [setCartItems],
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
  };
}
