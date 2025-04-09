import type {
  OrderSheetItem,
  OrderSheetResponse,
} from '@/app/api/checkout/[id]/route';

import { Button } from '@/components';
import { CardLayout, Modal } from '@/components/layouts';
import {
  CheckoutSummary,
  DeliveryForm,
  DeliverySummary,
  OrderProducts,
} from '../../_features';
import styles from './page.module.scss';

interface CheckoutViewProps {
  orderSheet: OrderSheetResponse;
  conditionalTitle: string;
  isModalOpen: boolean;
  totalPrice: number;
  totalPriceWithDeliveryFee: number;
  isAllCheckedAgreement: boolean;
  onModalControl: () => void;
  onPaymentOpen: () => void;
}

export default function CheckoutView({
  conditionalTitle,
  isModalOpen,
  orderSheet,
  totalPrice,
  totalPriceWithDeliveryFee,
  isAllCheckedAgreement,
  onModalControl,
  onPaymentOpen,
}: CheckoutViewProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.layout__left}>
        <CardLayout
          title="배송 정보"
          label={
            <CardLayout.Label
              text={conditionalTitle}
              onClick={onModalControl}
            />
          }
        >
          <DeliverySummary data={orderSheet.delivery} />
        </CardLayout>

        <CardLayout
          title={`주문 상품 (총 ${orderSheet.orderSheetItems?.length}건)`}
        >
          <div className={styles['products-inner']}>
            {orderSheet?.orderSheetItems?.map((item: OrderSheetItem) => (
              <OrderProducts
                item={item}
                key={`${item.productId}-${item.size}-${item.quantity}`}
                type="checkout"
              />
            ))}
          </div>
        </CardLayout>
      </div>

      <div className={styles.layout__right}>
        <CheckoutSummary
          totalPrice={totalPrice}
          totalPriceWithDeliveryFee={totalPriceWithDeliveryFee}
          type="결제"
        />

        <Button
          text="결제하기"
          onClick={onPaymentOpen}
          disabled={!isAllCheckedAgreement}
        />
      </div>

      {isModalOpen && (
        <Modal title={conditionalTitle}>
          <DeliveryForm onClose={onModalControl} />
        </Modal>
      )}
    </div>
  );
}
