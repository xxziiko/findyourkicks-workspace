'use client';

import { CartTable } from '@/features/cart';
import type { CartList } from '@/features/cart';
import { CheckoutSummary } from '@/features/order';
import { Button, commaizeNumberWithUnit } from '@findyourkicks/shared';
import styles from './CartView.module.scss';

interface CartViewProps {
  cartItems: CartList;
  totalProduct: number;
  totalPrice: number;
  isMutatingOrderSheet: boolean;
  totalPriceWithDeliveryFee: number;
  isAllChecked: boolean;
  checkedItems: { [cartId: string]: boolean };
  handleOrderSheet: () => void;
  handleOrderSheetForSingleProduct: (cartItemId: string) => void;
  handleToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggle: (
    e: React.ChangeEvent<HTMLInputElement>,
    cartId: string,
  ) => void;
  handleCartQuantityChange: (cartItemId: string, quantity: number) => void;
  handleDelete: (cartItemId: string) => void;
}

export default function CartView(props: CartViewProps) {
  const {
    isMutatingOrderSheet,
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    handleOrderSheet,
    handleOrderSheetForSingleProduct,
    handleToggleAll,
    handleToggle,
    handleCartQuantityChange,
    handleDelete,
    ...cartTableProps
  } = props;
  return (
    <section className={styles.section}>
      <CartTable
        {...cartTableProps}
        onToggleAll={handleToggleAll}
        onToggle={handleToggle}
        onQuantityChange={handleCartQuantityChange}
        onDelete={handleDelete}
        onCreateOrderSheetForSingleProduct={handleOrderSheetForSingleProduct}
      />

      <CheckoutSummary
        type="주문"
        totalPrice={totalPrice}
        totalPriceWithDeliveryFee={totalPriceWithDeliveryFee}
      />

      <Button
        isLoading={isMutatingOrderSheet}
        onClick={handleOrderSheet}
        disabled={totalProduct === 0}
        radius
      >
        {`${commaizeNumberWithUnit(totalPriceWithDeliveryFee, '원')} • 총 ${totalProduct}건 주문하기`}
      </Button>
    </section>
  );
}
