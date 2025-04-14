'use client';

import { DetailView, useDetail } from '@/app/product/[id]/_features';
import type { ProductDetail } from '@/features/product/types';

export default function Detail({ data }: { data: ProductDetail }) {
  const {
    productDetail,
    selectedOptions,
    totalQuantity,
    isMutatingCart,
    handleSelectSize,
    handleDeleteButton,
    handleQuantityChange,
    handleCartButton,
    getCurrentQuantity,
  } = useDetail({ data });

  const props = {
    productDetail,
    totalQuantity,
    selectedOptions,
    isMutatingCart,
    onSelectSize: handleSelectSize,
    onDelete: handleDeleteButton,
    onQuantityChange: handleQuantityChange,
    onCartButton: handleCartButton,
    getCurrentQuantity,
  };

  return <DetailView {...props} />;
}
