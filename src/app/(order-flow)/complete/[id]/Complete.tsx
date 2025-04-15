'use client';
import type { Order } from '@/features/order/types';
import { Button } from '@/shared/components';
import { CardLayout } from '@/shared/components/layouts';
import { CircleCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import styles from './page.module.scss';

interface InfoItem {
  title: string;
  getContent: (order: Order) => string | ReactNode;
}

const PAYMENT_INFO: InfoItem[] = [
  {
    title: '결제수단',
    getContent: ({ payment }) =>
      `${payment.paymentMethod}(${payment.paymentEasypayProvider})`,
  },
  {
    title: '결제금액',
    getContent: ({ payment }) => `${payment.amount.toLocaleString()}원`,
  },
];

const ORDER_INFO: InfoItem[] = [
  {
    title: '주문번호',
    getContent: (order) => <p>{order.orderId}</p>,
  },
  {
    title: '주문일시',
    getContent: (order) => <p>{order.orderDate}</p>,
  },
  {
    title: '주문상품',
    getContent: (order) => <p>{order.payment.orderName}</p>,
  },
  {
    title: '주문자명',
    getContent: (order) => <p>{order.address.receiverName}</p>,
  },
  {
    title: '배송정보',
    getContent: (order) => (
      <>
        <p className={styles.address}>{order.address.receiverName}</p>
        <p className={styles.address}>{order.address.receiverPhone}</p>
        <p className={styles.address}>{order.address.address}</p>
        <p className={styles.address}>{order.address.message}</p>
      </>
    ),
  },
];

const DELIVERY_FEE = 3000;

const TOTAL_INFO: InfoItem[] = [
  {
    title: '총 상품금액',
    getContent: (order) =>
      `${(order.payment.amount - DELIVERY_FEE).toLocaleString()}원`,
  },
  {
    title: '총 배송비',
    getContent: () => `${DELIVERY_FEE.toLocaleString()}원`,
  },
];

export default function Complete({ order }: { order: Order }) {
  const router = useRouter();
  return (
    <section className={styles.complete}>
      <div className={styles.complete__title}>
        <CircleCheck width={40} height={40} />
        <h3>결제가 완료되었어요!</h3>
      </div>

      <CardLayout title="주문 정보">
        <div className={styles.complete__info}>
          <h5>결제정보</h5>
          <div className={styles.complete__wrapper}>
            <div className={styles.complete__items}>
              {PAYMENT_INFO.map((item) => (
                <div key={item.title}>
                  <p className={styles.complete__subtitle}>{item.title}</p>
                  <p>{item.getContent(order)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.complete__wrapper}>
            {ORDER_INFO.map((item) => (
              <div key={item.title} className={styles.complete__item}>
                <h5>{item.title}</h5>
                <div>{item.getContent(order)}</div>
              </div>
            ))}
          </div>

          <div className={styles.complete__wrapper}>
            {TOTAL_INFO.map((item) => (
              <div key={item.title} className={styles.complete__item}>
                <h5>{item.title}</h5>
                <p>{item.getContent(order)}</p>
              </div>
            ))}
          </div>

          <div className={styles.complete__item}>
            <h5>총 결제 금액</h5>
            <p className={styles.complete__total}>
              {order.payment.amount.toLocaleString()}원
            </p>
          </div>
        </div>
      </CardLayout>

      <div className={styles.complete__button}>
        <Button text="주문내역 확인하기" variant="lined--r" width="20%" />
        <Button
          text="쇼핑 계속하기"
          width="20%"
          onClick={() => router.push('/')}
        />
      </div>
    </section>
  );
}
