'use client';
import { CheckoutSummary, OrderProduct } from '@/features/order';
import type { OrderProductItem } from '@/features/order-sheet/types';
import {
  AddressForm,
  AddressList,
  DeliverySummary,
} from '@/features/user/address';
import type { UserAddress } from '@/features/user/address/types';
import { Button } from '@/shared/components';
import { CardLayout, Modal } from '@/shared/components/layouts';
import styles from './CheckoutView.module.scss';

interface CheckoutViewProps {
  defaultAddress: UserAddress;
  orderProducts: OrderProductItem[];
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
          label={<CardLayout.Label text={title} onClick={onModalControl} />}
        >
          <DeliverySummary data={defaultAddress} />
        </CardLayout>

        <CardLayout title={`주문 상품 (총 ${orderProducts.length}건)`}>
          <div className={styles['products-inner']}>
            {orderProducts.map((product) => (
              <OrderProduct
                product={product}
                key={`${product.productId}-${product.size}-${product.quantity}`}
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
