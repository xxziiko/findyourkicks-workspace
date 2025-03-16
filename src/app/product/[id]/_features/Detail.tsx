'use client';

import Loading from '@/app/loading';
import { DetailView, useDetail } from '@/app/product/[id]/_features';

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

  if (!productDetail) return <Loading />;

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
