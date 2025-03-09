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
    createCart,
    selectSize,
    onDeleteButtonClick,
    onIncrementButtonClick,
    onDecrementButtonClick,
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

    selectSize,
    onDeleteButtonClick,
    onIncrementButtonClick,
    onDecrementButtonClick,
    handleCartButton,
  };

  return <DetailView {...props} />;
}
