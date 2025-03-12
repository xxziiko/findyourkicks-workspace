'use client';

import Loading from '@/app/loading';
import { useCartManager, useSelectedOptions } from '../hooks';
import DetailView from './DetailView';

export default function Detail() {
  const { createCart, resetSelectedOptions, item, ...rest } =
    useSelectedOptions();
  const { handleCartButton } = useCartManager({
    createCart,
    resetSelectedOptions,
  });

  if (!item) return <Loading />;

  const props = {
    item,
    handleCartButton,
    ...rest,
  };

  return <DetailView {...props} />;
}
