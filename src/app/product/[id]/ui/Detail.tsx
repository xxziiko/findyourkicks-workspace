'use client';

import Loading from '@/app/loading';
import { useCartManager, useSelectedOptions } from '../hooks';
import DetailView from './DetailView';

export default function Detail() {
  const {
    item,
    price,
    selectedOptions,
    inventory,
    totalQuantity,
    handleSelectSize,
    handleDeleteButton,
    handleIncrementButton,
    handleDecrementButton,
    createCart,
    resetSelectedOptions,
  } = useSelectedOptions();
  const { handleCartButton } = useCartManager({
    createCart,
    resetSelectedOptions,
  });

  if (!item) return <Loading />;

  const props = {
    item,
    inventory,
    totalQuantity,
    selectedOptions,
    price,

    onSelectSize: handleSelectSize,
    onDelete: handleDeleteButton,
    onIncrement: handleIncrementButton,
    onDecrement: handleDecrementButton,
    handleCartButton,
  };

  return <DetailView {...props} />;
}
