'use client';

import Loading from '@/app/loading';
import type {
  InventoryItem,
  OptionHandlers,
  ProductItem,
  SelectedOption,
} from '@/types/product';
import { useSelectedOptions } from './hooks';
import { DetailView } from './ui';

export type DetailViewProps = DetailViewBase & OptionHandlers;

interface DetailViewBase {
  productDetail: ProductItem;
  price: number;
  inventory: InventoryItem[];
  totalQuantity: number;
  selectedOptions: SelectedOption[];
  onSelectSize: (size: number) => () => void;
  onCartButton: () => void;
}

export default function Detail() {
  const {
    productDetail,
    price,
    selectedOptions,
    inventory,
    totalQuantity,
    handleSelectSize,
    handleDeleteButton,
    handleIncrementButton,
    handleDecrementButton,
    handleCartButton,
  } = useSelectedOptions();

  if (!productDetail) return <Loading />;

  const props = {
    productDetail,
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
