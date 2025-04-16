'use client';
import { CheckoutView, useCheckout } from '@/features/order';
import type { OrderSheetByIdResponse } from '@/features/order-sheet/types';

export default function Checkout({
  orderSheet,
}: { orderSheet: OrderSheetByIdResponse }) {
  const {
    defaultAddress,
    title,
    isModalOpen,
    isAllCheckedAgreement,
    totalPrice,
    totalPriceWithDeliveryFee,
    isMutatingOrderItems,
    modalView,
    orderProducts,
    handleModal,
    handlePayment,
    handleModalView,
    onCloseModal,
  } = useCheckout(orderSheet);

  const props = {
    defaultAddress,
    title,
    isModalOpen,
    isAllCheckedAgreement,
    totalPrice,
    orderProducts,
    totalPriceWithDeliveryFee,
    modalView,
    isMutatingOrderItems,
    onModalControl: handleModal,
    onPaymentOpen: handlePayment,
    onAddressListOpen: handleModalView,
    onCloseModal,
  };

  return <CheckoutView {...props} />;
}
