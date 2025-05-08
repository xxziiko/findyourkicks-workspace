'use client';

import type { ProductDetail, SelectedOption } from '@/features/product/types';
import { useCallback, useState } from 'react';

export default function useProductOption({
  productDetail,
}: {
  productDetail: ProductDetail;
}) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const totalQuantity = selectedOptions.reduce(
    (acc, cur) => acc + cur.quantity,
    0,
  );

  const optionPayload = selectedOptions.map((option) => ({
    product_id: productDetail.productId,
    price: productDetail.price,
    ...option,
  }));

  const isOutOfStock = ({
    stock,
    selectedSize,
  }: {
    stock: number;
    selectedSize: string;
  }) => {
    const currentQuantity =
      selectedOptions.find(({ size }) => size === selectedSize)?.quantity ?? 0;
    return stock === currentQuantity;
  };

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

  const resetOptions = () => {
    setSelectedOptions([]);
  };

  return {
    selectedOptions,
    totalQuantity,
    optionPayload,
    handleSelectSize,
    handleDeleteButton,
    handleQuantityChange,
    resetOptions,
    isOutOfStock,
  };
}
