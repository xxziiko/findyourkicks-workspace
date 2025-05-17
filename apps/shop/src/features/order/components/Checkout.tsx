'use client';
import { CheckoutView, useCheckout } from '@/features/order';
import type { OrderSheetByIdResponse } from '@/features/order-sheet/types';

export default function Checkout({
  orderSheet,
}: { orderSheet: OrderSheetByIdResponse }) {
  const {
    defaultAddress,
    addressModalTitle,
    isModalOpen,
    isAllCheckedAgreement,
    totalPrice,
    totalPriceWithDeliveryFee,
    isMutatingOrderItems,
    modalView,
    orderProducts,
    toggleModal,
    switchToFormView,
    closeModal,
    handlePayment,
  } = useCheckout(orderSheet);

  const props = {
    defaultAddress,
    addressModalTitle,
    isModalOpen,
    isAllCheckedAgreement,
    totalPrice,
    orderProducts,
    totalPriceWithDeliveryFee,
    modalView,
    isMutatingOrderItems,
    onModalControl: toggleModal,
    onPaymentOpen: handlePayment,
    onAddressListOpen: switchToFormView,
    onCloseModal: closeModal,
  };

  return <CheckoutView {...props} />;
}
