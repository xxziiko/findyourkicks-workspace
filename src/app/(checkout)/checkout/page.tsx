'use client';
import { Button } from '@/components';
import { CardLayout, Modal } from '@/components/layouts';
import {
  DeliveryForm,
  DeliveryInfo,
  OrderCard,
  ProductInfo,
} from '../_features';
import styles from './page.module.scss';
import useCheckout from './useCheckout';

const paymentRequestBody = {
  orderId: 'O_evBvXO_Ge2XwXA2xPtj', // 고유 주문번호
  orderName: '토스 티셔츠 외 2건',
  amount: 50000,
  customerEmail: 'customer123@gmail.com',
  customerName: '김토스',
  customerMobilePhone: '01012341234',
};

export default function Checkout() {
  const {
    conditionalTitle,
    MOCK_ADDRESS,
    cartItems,
    isModalOpen,
    handleModal,
    requestPayment,
  } = useCheckout();

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

        {/* FIXME: 데이터 */}
        <CardLayout title={`주문 상품 (총 ${cartItems.length}건)`}>
          <div className={styles['products-inner']}>
            {cartItems.map((item) => (
              <ProductInfo item={item} key={item.cartId} type="checkout" />
            ))}
          </div>
        </CardLayout>

        <CardLayout title="결제 수단">
          <div className={styles.buttons}>
            <Button text="카드 결제" onClick={() => {}} width="50%" />
            <Button
              text="무통장 입금"
              onClick={() => {}}
              width="50%"
              disabled
            />
          </div>
        </CardLayout>
      </div>

      <div className={styles.layout__right}>
        <OrderCard
          totalPrice={10000}
          totalPriceWithDeliveryFee={13000}
          type="결제"
        />

        <Button
          text="결제하기"
          onClick={() => requestPayment(paymentRequestBody)}
        />
      </div>

      {isModalOpen && (
        <Modal onClose={handleModal} title={conditionalTitle}>
          <DeliveryForm />
        </Modal>
      )}
    </div>
  );
}
