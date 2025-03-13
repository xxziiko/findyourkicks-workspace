'use client';

import { Button } from '@/components';
import { ChevronsRight } from 'lucide-react';
import type { CartViewProps } from '../components/Cart';
import CartList from '../components/CartList';
import styles from './CartView.module.scss';

export default function CartView(props: CartViewProps) {
  const {
    totalProduct,
    totalPrice,
    totalPriceWithDeliveryFee,
    ...cartListProps
  } = props;

  return (
    <section className={styles.section}>
      <CartHeader />
      {/* progress components */}
      <CartList {...cartListProps} />
      <OrderCard
        totalPrice={totalPrice.toLocaleString()}
        totalPriceWithDeliveryFee={totalPriceWithDeliveryFee.toLocaleString()}
      />

      <Button
        text={`${totalPriceWithDeliveryFee}원 • 총 ${totalProduct}건 주문하기`}
        onClick={() => {}}
      />
    </section>
  );
}

function CartHeader() {
  return (
    <div className={styles.title}>
      <h1 className={styles.title__head}>장바구니</h1>

      <div className={styles.title__progress}>
        <div className={styles['title__progress--active']}>
          <p>장바구니 </p>
          <ChevronsRight />
        </div>
        <p className={styles.title__progress}>주문/결제</p>
        <ChevronsRight />
        <p className={styles.title__progress}>주문완료</p>
      </div>
    </div>
  );
}

function OrderCard({
  totalPrice,
  totalPriceWithDeliveryFee,
}: { totalPrice: string; totalPriceWithDeliveryFee: string }) {
  return (
    <div className={styles.order}>
      <div className={styles.order__title}>
        <p>선택 주문정보</p>
      </div>

      <div className={styles.order__content}>
        <div className={styles['order__content--item']}>
          <p>총 상품 금액</p>
          <p>{totalPrice}원</p>
        </div>

        <div className={styles['order__content--item']}>
          <p>총 배송비</p>
          <p>3,000원</p>
        </div>
      </div>

      <div className={styles.order__total_price}>
        <p>총 예상 결제금액</p>
        <p>{totalPriceWithDeliveryFee}원</p>
      </div>
    </div>
  );
}
