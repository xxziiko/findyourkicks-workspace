'use client';
import type { OrderSheetResponse } from '@/app/api/checkout/[id]/route';
import CheckoutView from './CheckoutView';
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

  const props = {
    conditionalTitle,
    isModalOpen,
    isAllCheckedAgreement,
    totalPrice,
    totalPriceWithDeliveryFee,
    onModalControl: handleModal,
    onPaymentOpen: handlePayment,
    orderSheet,
  };

  return <CheckoutView {...props} />;
}
