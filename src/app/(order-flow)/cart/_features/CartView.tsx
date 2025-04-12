'use client';

import { Button } from '@/components';
import { CheckoutSummary } from '../../_features';
import styles from '../page.module.scss';
import CartList, { type CartListProps } from './CartList';

interface CartViewProps extends CartListProps {
  totalProduct: number;
  totalPrice: number;
  totalPriceWithDeliveryFee: number;
  onCreateOrderSheet: () => void;
}

export default function CartView(props: CartViewProps) {
  const {
    isLoading,
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    onCreateOrderSheet,
    onCreateOrderSheetForSingleProduct,
    ...cartListProps
  } = props;
  return (
    <section className={styles.section}>
      <CartList
        {...cartListProps}
        isLoading={isLoading}
        onCreateOrderSheetForSingleProduct={onCreateOrderSheetForSingleProduct}
      />

      <CheckoutSummary
        type="주문"
        totalPrice={totalPrice}
        totalPriceWithDeliveryFee={totalPriceWithDeliveryFee}
      />

      <Button
        isLoading={isLoading}
        text={`${totalPriceWithDeliveryFee.toLocaleString()}원 • 총 ${totalProduct}건 주문하기`}
        onClick={onCreateOrderSheet}
        disabled={totalProduct === 0}
      />
    </section>
  );
}
