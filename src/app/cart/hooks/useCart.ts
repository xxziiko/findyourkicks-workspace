import { cartItemsAtom } from '@/app/lib/store';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';

export default function useCart() {
  const [items, setItems] = useAtom(cartItemsAtom);
  const [checkedItems, setCheckedItems] = useState<{
    [cartId: string]: boolean;
  }>(Object.fromEntries(items.map((item) => [item.cartId, true])));

  const totalProduct = Object.values(checkedItems).filter(
    (checkedItem) => !!checkedItem,
  ).length;

  const totalPrice = items
    .filter((item) => checkedItems[item.cartId] ?? false)
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  const totalPriceWithDeliveryFee = totalProduct === 0 ? 0 : totalPrice + 3000;

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setCheckedItems(
      Object.fromEntries(items.map((item) => [item.cartId, checked])),
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
        setItems((prev) =>
          prev.map((item) =>
            item.cartId === cartId ? { ...item, quantity: quantity } : item,
          ),
        );
      }
    },
    [setItems],
  );

  const handleDelete = useCallback(
    (cartId: string) => () => {
      setItems((prev) => prev.filter((item) => item.cartId !== cartId));
      setCheckedItems((prev) => ({ ...prev, [cartId]: false }));
    },
    [setItems],
  );

  return {
    items,
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
