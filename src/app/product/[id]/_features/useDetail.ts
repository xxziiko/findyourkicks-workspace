'use client';
import { cartItemsAtom, isAuthenticatedAtom } from '@/lib/store';
import type { CartItem, SelectedOption } from '@/lib/types';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { Detail } from './Detail';

export default function useDetail({ data: product }: { data: Detail }) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const setCart = useSetAtom(cartItemsAtom);
  const router = useRouter();

  const totalQuantity = selectedOptions.reduce(
    (acc, cur) => acc + cur.quantity,
    0,
  );

  const getCurrentQuantity = (selectedSize: string) =>
    selectedOptions.find(({ size }) => size === selectedSize)?.quantity ?? 0;

  const handleSelectSize = useCallback((id: string) => {
    setSelectedOptions((prev) => {
      const index = prev.findIndex((option) => option.size === id);
      if (index !== -1) {
        return prev.map((option, i) =>
          i === index ? { ...option, quantity: option.quantity + 1 } : option,
        );
      }
      return [...prev, { size: id, quantity: 1 }];
    });
  }, []);

  const handleDeleteButton = useCallback((id: string) => {
    setSelectedOptions((prev) => prev.filter((option) => option.size !== id));
  }, []);

  const handleQuantityChange = useCallback(
    (id: string, quantity: number) => {
      const initialStock =
        product.inventory.find((item) => item.size === id)?.stock ?? 0;

      if (quantity >= 1 && quantity <= initialStock) {
        setSelectedOptions((prev) =>
          prev.map((option) =>
            option.size === id ? { ...option, quantity } : option,
          ),
        );
      }
    },
    [product],
  );

  const resetSelectedOptions = () => {
    setSelectedOptions([]);
  };

  const createCart = () => {
    return selectedOptions.map(
      (option) =>
        ({
          cartId: crypto.randomUUID(),
          ...option,
          ...product,
        }) as CartItem,
    );
  };

  const mergeCartItems = (updatedCart: CartItem[]) => {
    const cartItems = createCart();

    cartItems.forEach((newItem) => {
      const index = updatedCart.findIndex(
        (cartItem) =>
          cartItem.productId === newItem.productId &&
          cartItem.size === newItem.size,
      );

      if (index !== -1) {
        updatedCart[index].quantity += newItem.quantity;
        return;
      }

      updatedCart.push(newItem);
    });
  };

  const addCart = () => {
    setCart((prev) => {
      const updatedCart = [...prev];
      mergeCartItems(updatedCart);

      return updatedCart;
    });
    resetSelectedOptions();
  };

  const handleCartButton = () => {
    if (isAuthenticated) {
      addCart();
      //TODO: modal
      return;
    }

    router.push('/login');
  };

  return {
    product,
    selectedOptions,
    totalQuantity,

    handleSelectSize,
    handleDeleteButton,
    handleQuantityChange,
    resetSelectedOptions,
    createCart,
    handleCartButton,
    getCurrentQuantity,
  };
}
