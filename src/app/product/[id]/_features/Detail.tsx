'use client';

import { DetailView, useDetail } from '@/app/product/[id]/_features';
import type { ProductItem } from '@/app/product/_features/ProductListView';
import type { InventoryItem } from '@/lib/types';

export type Detail = ProductItem & {
  description: string;
  inventory: InventoryItem[];
};

export default function Detail({ data }: { data: Detail }) {
  const {
    product,
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
    product,
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
