'use client';
import type {
  OrderSheetItem,
  OrderSheetResponse,
} from '@/app/api/checkout/[id]/route';
import { Button } from '@/components';
import { CardLayout, Modal } from '@/components/layouts';
import {
  DeliveryForm,
  DeliveryInfo,
  OrderCard,
  ProductInfo,
} from '../../_features';
import styles from './page.module.scss';
import useCheckout from './useCheckout';

export default function Checkout({
  id,
  orderSheet,
}: { id: string; orderSheet: OrderSheetResponse }) {
  const {
    conditionalTitle,
    isModalOpen,
    isAllCheckedAgreement,
    totalPrice,
    totalPriceWithDeliveryFee,
    handleModal,
    handlePayment,
  } = useCheckout(orderSheet);

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
          <DeliveryInfo data={orderSheet.deliveryInfo} />
        </CardLayout>

        <CardLayout
          title={`주문 상품 (총 ${orderSheet.orderSheetItems?.length}건)`}
        >
          <div className={styles['products-inner']}>
            {orderSheet?.orderSheetItems?.map((item: OrderSheetItem) => (
              <ProductInfo
                item={item}
                key={`${item.productId}-${item.size}-${item.quantity}`}
                type="checkout"
              />
            ))}
          </div>
        </CardLayout>
      </div>

      <div className={styles.layout__right}>
        <OrderCard
          totalPrice={totalPrice}
          totalPriceWithDeliveryFee={totalPriceWithDeliveryFee}
          type="결제"
        />

        <Button
          text="결제하기"
          onClick={handlePayment}
          disabled={!isAllCheckedAgreement}
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
