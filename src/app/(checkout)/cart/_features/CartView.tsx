'use client';

import { Button } from '@/components';
import CartList, { type CartListProps } from './CartList';
import styles from './CartView.module.scss';

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
    ...cartListProps
  } = props;
  return (
    <section className={styles.section}>
      <CartList {...cartListProps} />

      <OrderCard
        totalPrice={totalPrice}
        totalPriceWithDeliveryFee={totalPriceWithDeliveryFee}
      />

      <Button
        text={`${totalPriceWithDeliveryFee.toLocaleString()}원 • 총 ${totalProduct}건 주문하기`}
        onClick={() => {}}
      />
    </section>
  );
}

function OrderCard({
  totalPrice,
  totalPriceWithDeliveryFee,
}: { totalPrice: number; totalPriceWithDeliveryFee: number }) {
  return (
    <div className={styles.order}>
      <div className={styles.order__title}>
        <p>선택 주문정보</p>
      </div>

      <div className={styles.order__content}>
        <div className={styles['order__content--item']}>
          <p>총 상품 금액</p>
          <p>{totalPrice.toLocaleString()}원</p>
        </div>

        <div className={styles['order__content--item']}>
          <p>총 배송비</p>
          <p>3,000원</p>
        </div>
      </div>

      <div className={styles.order__total_price}>
        <p>총 예상 결제금액</p>
        <p>{totalPriceWithDeliveryFee.toLocaleString()}원</p>
      </div>
    </div>
  );
}
