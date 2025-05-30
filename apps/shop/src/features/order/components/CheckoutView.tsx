'use client';
import { CheckoutSummary, OrderProduct } from '@/features/order';
import type { OrderProductItem } from '@/features/order';
import {
  AddressForm,
  AddressList,
  DeliverySummary,
} from '@/features/user/address';
import type { UserAddress } from '@/features/user/address';
import { CardLayout } from '@/shared/components/layouts';
import { Button, Modal } from '@findyourkicks/shared';
import styles from './CheckoutView.module.scss';

interface CheckoutViewProps {
  defaultAddress: UserAddress;
  orderProducts: OrderProductItem[];
  addressModalTitle: string;
  modalView: 'form' | 'list';
  isModalOpen: boolean;
  isMutatingOrderItems: boolean;
  totalPrice: number;
  totalPriceWithDeliveryFee: number;
  isAllCheckedAgreement: boolean;
  onModalControl: () => void;
  onPaymentOpen: () => void;
  onAddressListOpen: () => void;
  onCloseModal: () => void;
}

export default function CheckoutView({
  defaultAddress,
  addressModalTitle,
  isModalOpen,
  modalView,
  orderProducts,
  totalPrice,
  totalPriceWithDeliveryFee,
  isAllCheckedAgreement,
  isMutatingOrderItems,
  onModalControl,
  onPaymentOpen,
  onAddressListOpen,
  onCloseModal,
}: CheckoutViewProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.layout__left}>
        <CardLayout
          title="배송 정보"
          label={
            <CardLayout.Label
              text={addressModalTitle}
              onClick={onModalControl}
            />
          }
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
          onClick={onPaymentOpen}
          disabled={!isAllCheckedAgreement || !defaultAddress.addressId}
          isLoading={isMutatingOrderItems}
          radius
        >
          결제하기
        </Button>
      </div>

      {isModalOpen && (
        <Modal title={addressModalTitle}>
          {modalView === 'list' ? (
            <div>
              <Button
                onClick={onAddressListOpen}
                variant="secondary"
                width="100%"
              >
                배송지 추가하기
              </Button>

              <AddressList onClose={onCloseModal} />
            </div>
          ) : (
            <AddressForm onClose={onCloseModal} />
          )}
        </Modal>
      )}
    </div>
  );
}
