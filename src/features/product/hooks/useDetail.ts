'use client';

import { useCartItemMutation } from '@/features/cart';
import type { ProductDetail, SelectedOption } from '@/features/product/types';
import { useCallback, useState } from 'react';

export default function useDetail({
  data: productDetail,
}: { data: ProductDetail }) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  const { mutate: mutateCart, isPending: isMutatingCart } =
    useCartItemMutation();

  const totalQuantity = selectedOptions.reduce(
    (acc, cur) => acc + cur.quantity,
    0,
  );

  const getCurrentQuantity = (selectedSize: string) =>
    selectedOptions.find(({ size }) => size === selectedSize)?.quantity ?? 0;

  const handleSelectSize = useCallback((id: string) => {
    setSelectedOptions((prev) => {
      //FIXME: 네이밍, 메서드 변경 (findIndex -> find)
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
        productDetail.inventory.find((item) => item.size === id)?.stock ?? 0;

      if (quantity >= 1 && quantity <= initialStock) {
        setSelectedOptions((prev) =>
          prev.map((option) =>
            option.size === id ? { ...option, quantity } : option,
          ),
        );
      }
    },
    [productDetail],
  );

  const resetSelectedOptions = () => {
    setSelectedOptions([]);
  };

  const handleCartButton = () => {
    const cartItems = selectedOptions.map((option) => ({
      product_id: productDetail.productId,
      price: productDetail.price,
      ...option,
    }));

    mutateCart(cartItems);
    resetSelectedOptions();
  };

  return {
    isMutatingCart,
    productDetail,
    selectedOptions,
    totalQuantity,

    handleSelectSize,
    handleDeleteButton,
    handleQuantityChange,
    resetSelectedOptions,
    handleCartButton,
    getCurrentQuantity,
  };
}
