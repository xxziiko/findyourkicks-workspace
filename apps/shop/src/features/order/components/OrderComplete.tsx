'use client';
import type { OrderByIdResponse } from '@/features/order';
import { CardLayout } from '@/shared/components/layouts';
import { PATH } from '@/shared/constants/path';
import { Button } from '@findyourkicks/shared';
import { CircleCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './OrderComplete.module.scss';

const DELIVERY_FEE = 3000 as const;

export default function OrderComplete({ order }: { order: OrderByIdResponse }) {
  const { orderId, orderDate, payment, address } = order;

  const orderView = {
    주문번호: orderId,
    주문일시: orderDate,
    주문상품: payment.orderName,
    주문자명: address.receiverName,
  } as const;

  const totalView = {
    총상품금액: payment.amount - DELIVERY_FEE,
    총배송비: DELIVERY_FEE,
  } as const;

  const router = useRouter();

  return (
    <section className={styles.order}>
      <div className={styles.order__title}>
        <CircleCheck width={40} height={40} />
        <h3>결제가 완료되었어요!</h3>
      </div>

      <CardLayout title="주문 정보">
        <div className={styles.order__content}>
          <h5>결제정보</h5>

          <ContentSection>
            <div className={styles.content__items}>
              <div>
                <p className={styles.content__subtitle}>결제 수단</p>
                <p className={styles.content__text}>
                  {`${order.payment.paymentMethod} (${order.payment.paymentEasypayProvider})`}
                </p>
              </div>

              <div>
                <p className={styles.content__subtitle}>결제 금액</p>
                <p className={styles.content__text}>
                  {order.payment.amount.toLocaleString()}원
                </p>
              </div>
            </div>
          </ContentSection>

          <ContentSection>
            {Object.entries(orderView).map(([title, content]) => (
              <ContentItem key={title} title={title}>
                <p className={styles.content__text}>{content}</p>
              </ContentItem>
            ))}
          </ContentSection>

          <ContentSection>
            <ContentItem title="배송정보">
              <div>
                {Object.entries(address).map(([key, content]) => (
                  <p key={key} className={styles.address}>
                    {content}
                  </p>
                ))}
              </div>
            </ContentItem>
          </ContentSection>

          <ContentSection>
            {Object.entries(totalView).map(([title, content]) => (
              <ContentItem key={title} title={title}>
                <p className={styles.content__text}>
                  {content.toLocaleString()}원
                </p>
              </ContentItem>
            ))}
          </ContentSection>

          <ContentSection>
            <ContentItem title="총 결제 금액">
              <p className={styles['content__total-price']}>
                {payment.amount.toLocaleString()}원
              </p>
            </ContentItem>
          </ContentSection>
        </div>
      </CardLayout>

      <div className={styles.buttons}>
        <Button
          variant="secondary"
          radius
          width="30%"
          onClick={() => router.push(PATH.myOrders)}
        >
          주문내역 확인하기
        </Button>
        <Button width="30%" radius onClick={() => router.push(PATH.home)}>
          쇼핑 계속하기
        </Button>
      </div>
    </section>
  );
}

function ContentSection({ children }: { children: React.ReactNode }) {
  return <div className={styles.content}>{children}</div>;
}

function ContentItem({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.content__item}>
      <h5>{title}</h5>
      {children}
    </div>
  );
}
