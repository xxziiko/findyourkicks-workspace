'use client';
import { Button } from '@/components';
import { CardLayout, Modal } from '@/components/layouts';
import { cartItemsAtom } from '@/lib/store';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import {
  DeliveryForm,
  DeliveryInfo,
  OrderCard,
  ProductInfo,
} from '../_features';
import styles from './page.module.scss';

const MOCK_ADDRESS = {
  id: 0,
  alias: '우리집',
  name: '홍길동',
  phone: '010-1234-1234',
  address: '[13607] 경기도 성남시 분당구 백현로',
};

// const MOCK_ADDRESS = null;

export default function Checkout() {
  const cartItems = useAtomValue(cartItemsAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const conditionalTitle = !MOCK_ADDRESS ? '주소 입력' : '주소 변경';

  const handleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <div className={styles.layout}>
      <div className={styles.layout__left}>
        <CardLayout
          title="배송 정보"
          label={
            <CardLayout.Label text={conditionalTitle} onClick={handleModal} />
          }
          onLabelClick={handleModal}
        >
          <DeliveryInfo data={MOCK_ADDRESS} />
        </CardLayout>

        {/* TODO: 주문상품 list */}
        <CardLayout title={`주문 상품 (총 ${cartItems.length}건)`}>
          <div className={styles['products-inner']}>
            {cartItems.map((item) => (
              // 임시 데이터
              <ProductInfo item={item} key={item.cartId} type="checkout" />
            ))}
          </div>
        </CardLayout>

        <CardLayout title="결제 수단">
          <div className={styles.buttons}>
            <Button text="카드 결제" onClick={() => {}} width="50%" />
            <Button text="무통장 입금" onClick={() => {}} width="50%" />
          </div>
        </CardLayout>
      </div>

      <div className={styles.layout__right}>
        <OrderCard
          totalPrice={10000}
          totalPriceWithDeliveryFee={13000}
          type="결제"
        />

        <Button text="결제하기" onClick={() => {}} />
      </div>

      {isModalOpen && (
        <Modal onClose={handleModal} title={conditionalTitle}>
          <DeliveryForm />
        </Modal>
      )}
    </div>
  );
}
