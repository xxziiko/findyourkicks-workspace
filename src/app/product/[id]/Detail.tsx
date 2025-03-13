'use client';

import Loading from '@/app/loading';
import type {
  InventoryItem,
  OptionHandlers,
  ProductItem,
  SelectedOption,
} from '@/types/product';
import { useCartManager, useSelectedOptions } from './hooks';
import { DetailView } from './ui';

export type DetailViewProps = DetailViewBase & OptionHandlers;

interface DetailViewBase {
  item: ProductItem;
  price: number;
  inventory: InventoryItem[];
  totalQuantity: number;
  selectedOptions: SelectedOption[];
  onSelectSize: (size: number) => () => void;
  onCartButton: () => void;
}

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
    onCartButton: handleCartButton,
  };

  return <DetailView {...props} />;
}
