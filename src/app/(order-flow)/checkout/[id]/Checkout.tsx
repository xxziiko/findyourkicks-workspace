'use client';
import type { OrderSheetResponse } from '@/app/api/checkout/[id]/route';
import CheckoutView from './CheckoutView';
import useCheckout from './useCheckout';

export default function Checkout({
  orderSheet,
}: { orderSheet: OrderSheetResponse }) {
  const {
    defaultAddress,
    title,
    isModalOpen,
    isAllCheckedAgreement,
    totalPrice,
    totalPriceWithDeliveryFee,
    isMutatingOrderItems,
    modalView,
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
    orderSheet,
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
