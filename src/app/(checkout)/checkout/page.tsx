'use client';
import { Button, Dropdown } from '@/components';
import { CardLayout } from '@/components/layouts';
import { cartItemsAtom } from '@/lib/store';
import { useAtomValue } from 'jotai';
import { OrderCard, ProductInfo } from '../_features';
import styles from './page.module.scss';

const MOCK_ADDRESS = {
  id: 0,
  alias: '우리집',
  name: '홍길동',
  phone: '010-1234-1234',
  address: '[13607] 경기도 성남시 분당구 백현로',
};

const DELIVERY_TEXT = [
  '요청사항 없음',
  '경비실에 보관해주세요.',
  '문 앞에 놓아주세요.',
  '직접 입력',
];

export default function Checkout() {
  const cartItems = useAtomValue(cartItemsAtom);

  return (
    <div className={styles.layout}>
      <div className={styles.layout__left}>
        {/* TODO:  배송지 정보 input modal form*/}
        <CardLayout title="배송 정보" label>
          <DeliveryInfo />
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
            <Button text="카드 결제" onClick={() => {}} />
            <Button text="무통장 입금" onClick={() => {}} />
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
    </div>

      {isModalOpen && (
        <Modal onClose={handleModal} title={conditionalTitle}>
          <DeliveryForm />
        </Modal>
      )}
  );
}
