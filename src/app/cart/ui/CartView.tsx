'use client';

import { CartListItem, NoListData } from '@/app/cart/ui';
import { Button, CheckBox } from '@/components';
import { ChevronsRight } from 'lucide-react';
import type { CartViewProps } from './Cart';
import styles from './CartView.module.scss';

export default function CartView({ items, ...props }: CartViewProps) {
  const active = '--active';

  return (
    <section className={styles.section}>
      <div className={styles.title}>
        <h1 className={styles.title__head}>장바구니</h1>

        <div className={styles.title__progress}>
          <div className={styles[`title__progress${active}`]}>
            <p>장바구니 </p>
            <ChevronsRight />
          </div>
          <p className={styles.title__progress}>주문/결제</p>
          <ChevronsRight />
          <p className={styles.title__progress}>주문완료</p>
        </div>
      </div>

      {/* progress components */}
      <div className={styles.list}>
        <div className={styles.list__header}>
          <CheckBox />
          <p>상품/옵션 정보</p>
          <p>수량</p>
          <p>주문 금액</p>
          <div />
        </div>
        {!items.length && <NoListData />}
        {items.map((item) => (
          <CartListItem key={item.cartId} item={item} {...props} />
        ))}
      </div>

      <div className={styles.order}>
        <div className={styles.order__title}>
          <p>선택 주문정보</p>
        </div>

        <div className={styles.order__content}>
          <div className={styles['order__content--item']}>
            <p>총 상품 금액</p>
            <p>원</p>
          </div>

          <div className={styles['order__content--item']}>
            <p>총 배송비</p>
            <p>3,000원</p>
          </div>
        </div>

        <div className={styles.order__total_price}>
          <p>총 예상 결제금액</p>
          <p>원</p>
        </div>
      </div>

      <Button text={`${0}원 • 총${0}건 주문하기`} onClick={() => {}} />
    </section>
  );
}
