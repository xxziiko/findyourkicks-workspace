'use client';

import { DetailView, useDetail } from '@/app/product/[id]/_features';
import DetailLoading from '../loading';

export default function Detail() {
  const {
    productDetail,
    price,
    selectedOptions,
    inventory,
    totalQuantity,
    handleSelectSize,
    handleDeleteButton,
    handleQuantityChange,
    handleCartButton,
  } = useDetail();

  if (!productDetail) return <DetailLoading />;

  const props = {
    productDetail,
    inventory,
    totalQuantity,
    selectedOptions,
    price,

    onSelectSize: handleSelectSize,
    onDelete: handleDeleteButton,
    onQuantityChange: handleQuantityChange,
    onCartButton: handleCartButton,
  };

  return <DetailView {...props} />;
}
