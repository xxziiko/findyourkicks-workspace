'use client';
import type {
  Address,
  OrderSheetItem,
  OrderSheetResponse,
} from '@/app/api/checkout/[id]/route';
import { Button } from '@/components';
import { CardLayout, Modal } from '@/components/layouts';
import {
  AddressForm,
  AddressList,
  CheckoutSummary,
  DeliverySummary,
  OrderProducts,
} from '../../_features';
import styles from './page.module.scss';

interface CheckoutViewProps {
  defaultAddress: Address;
  orderSheet: OrderSheetResponse;
  title: string;
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
  title,
  isModalOpen,
  modalView,
  orderSheet,
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
          label={<CardLayout.Label text={title} onClick={onModalControl} />}
        >
          <DeliverySummary data={defaultAddress} />
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
          disabled={!isAllCheckedAgreement || !defaultAddress.addressId}
          isLoading={isMutatingOrderItems}
        />
      </div>

      {isModalOpen && (
        <Modal title={title}>
          {modalView === 'list' ? (
            <div>
              <Button
                text="배송지 추가하기"
                onClick={onAddressListOpen}
                variant="lined"
                width="100%"
              />

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
