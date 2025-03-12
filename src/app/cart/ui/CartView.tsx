'use client';

import { CartListItem } from '@/app/cart/ui';
import { CheckBox } from '@/components';
import { ChevronsRight } from 'lucide-react';
import type { CartViewProps } from './Cart';
import styles from './CartView.module.scss';

export default function CartView({ items, ...props }: CartViewProps) {
  const active = '--active';

  return (
    <section>
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

      {/* 리스트 */}
      <div className={styles.list}>
        <div className={styles.list__header}>
          <CheckBox />
          <p>상품/옵션 정보</p>
          <p>수량</p>
          <p>주문 금액</p>
          <div />
        </div>
        {items.map((item) => (
          <CartListItem key={item.cartId} item={item} {...props} />
        ))}
      </div>
    </section>
  );
}
