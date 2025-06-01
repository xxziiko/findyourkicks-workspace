'use client';
import { CheckoutSummary, OrderProduct } from '@/features/order';
import type { OrderProductItem } from '@/features/order';
import { AddressModal, DeliverySummary } from '@/features/user/address';
import type { UserAddress } from '@/features/user/address';
import { CardLayout } from '@/shared/components/layouts';
import { Button } from '@findyourkicks/shared';
import styles from './CheckoutView.module.scss';

interface CheckoutViewProps {
  address: {
    defaultAddress: UserAddress;
    modalTitle: string;
    modalView: 'form' | 'list';
    isModalOpen: boolean;
    onCloseModal: () => void;
    onSwitchToFormView: () => void;
    onModalToggle: () => void;
  };
  price: {
    totalPrice: number;
    totalPriceWithDeliveryFee: number;
  };
  agreement: {
    isAllChecked: boolean;
  };
  order: {
    items: OrderProductItem[];
    isMutating: boolean;
    onPayment: () => void;
  };
}

export default function CheckoutView({
  address,
  price,
  agreement,
  order,
}: CheckoutViewProps) {
  const {
    defaultAddress,
    modalTitle,
    modalView,
    isModalOpen,
    onModalToggle,
    onCloseModal,
  } = address;
  const { totalPrice, totalPriceWithDeliveryFee } = price;
  const { isAllChecked } = agreement;
  const { items: orderProducts, isMutating, onPayment } = order;

  return (
    <div className={styles.layout}>
      <div className={styles.layout__left}>
        <CardLayout
          title="배송 정보"
          label={<CardLayout.Label text={modalTitle} onClick={onModalToggle} />}
        >
          <DeliverySummary data={defaultAddress} />
        </CardLayout>

        <CardLayout title={`주문 상품 (총 ${orderProducts.length}건)`}>
          <div className={styles['products-inner']}>
            {orderProducts.map((product) => (
              <OrderProduct product={product} key={product.id} type="order" />
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
          onClick={onPayment}
          disabled={!isAllChecked || !defaultAddress.addressId}
          isLoading={isMutating}
          radius
        >
          결제하기
        </Button>
      </div>

      {isModalOpen && (
        <AddressModal
          addressModalTitle={modalTitle}
          modalView={modalView}
          isOpen={isModalOpen}
          onClick={onModalToggle}
          onClose={onCloseModal}
        />
      )}
    </div>
  );
}
