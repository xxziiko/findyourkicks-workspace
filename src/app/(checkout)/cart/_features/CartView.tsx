'use client';

import { Button } from '@/components';
import { OrderCard } from '../../_features';
import styles from '../page.module.scss';
import CartList, { type CartListProps } from './CartList';

interface CartViewProps extends CartListProps {
  totalProduct: number;
  totalPrice: number;
  totalPriceWithDeliveryFee: number;
}

export default function CartView(props: CartViewProps) {
  const {
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    onNextStep,
    ...cartListProps
  } = props;
  return (
    <section className={styles.section}>
      <CartList {...cartListProps} onNextStep={onNextStep} />

      <OrderCard
        type="주문"
        totalPrice={totalPrice}
        totalPriceWithDeliveryFee={totalPriceWithDeliveryFee}
      />

      <Button
        text={`${totalPriceWithDeliveryFee.toLocaleString()}원 • 총 ${totalProduct}건 주문하기`}
        // onClick={onNextStep}
        onClick={() => {}}
      />
    </section>
  );
}
