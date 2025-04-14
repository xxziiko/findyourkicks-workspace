'use client';
import type { OrderSheetByIdResponse } from '@/features/order-sheet/types';
import CheckoutView from './CheckoutView';
import useCheckout from './useCheckout';

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
