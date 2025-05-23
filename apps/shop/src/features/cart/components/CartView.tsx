'use client';

import Loading from '@/app/loading';
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
  onCreateOrderSheet: () => void;
  onCreateOrderSheetForSingleProduct: (cartItemId: string) => void;
  onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>, cartId: string) => void;
  onQuantityChange: (cartItemId: string, quantity: number) => void;
  onDelete: (cartItemId: string) => void;
}

export default function CartView(props: CartViewProps) {
  const {
    isMutatingOrderSheet,
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    onCreateOrderSheet,
    onCreateOrderSheetForSingleProduct,
    ...cartTableProps
  } = props;
  return isMutatingOrderSheet ? (
    <Loading />
  ) : (
    <section className={styles.section}>
      <CartTable
        {...cartTableProps}
        onCreateOrderSheetForSingleProduct={onCreateOrderSheetForSingleProduct}
      />

      <CheckoutSummary
        type="주문"
        totalPrice={totalPrice}
        totalPriceWithDeliveryFee={totalPriceWithDeliveryFee}
      />

      <Button
        isLoading={isMutatingOrderSheet}
        onClick={onCreateOrderSheet}
        disabled={totalProduct === 0}
        radius
      >
        {`${commaizeNumberWithUnit(totalPriceWithDeliveryFee, '원')} • 총 ${totalProduct}건 주문하기`}
      </Button>
    </section>
  );
}
