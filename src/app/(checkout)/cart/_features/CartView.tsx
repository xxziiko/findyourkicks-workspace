'use client';

import { Button } from '@/components';
import { OrderCard } from '../../_features';
import styles from '../page.module.scss';
import CartList, { type CartListProps } from './CartList';

interface CartViewProps extends CartListProps {
  totalProduct: number;
  totalPrice: number;
  totalPriceWithDeliveryFee: number;
  onAllOrderSheet: () => void;
}

export default function CartView(props: CartViewProps) {
  const {
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    onAllOrderSheet,
    onOrderSheet,
    ...cartListProps
  } = props;
  return (
    <section className={styles.section}>
      <CartList {...cartListProps} onOrderSheet={onOrderSheet} />

      <OrderCard
        type="주문"
        totalPrice={totalPrice}
        totalPriceWithDeliveryFee={totalPriceWithDeliveryFee}
      />

      <Button
        text={`${totalPriceWithDeliveryFee.toLocaleString()}원 • 총 ${totalProduct}건 주문하기`}
        onClick={onAllOrderSheet}
      />
    </section>
  );
}
