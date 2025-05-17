'use client';

import { useOrderItemsMutation } from '@/features/order';
import { createOrderSheetSummary } from '@/features/order';
import { useTossPayments } from '@/features/order';
import type { OrderSheetByIdResponse } from '@/features/order-sheet/types';
import type { PaymentsResponse } from '@/features/payment/types';
import {
  useAddressModal,
  useDefaultAddressQuery,
} from '@/features/user/address';
import { useCheckoutAgreement, useDeliveryMessage } from '@/shared/hooks';

export function useCheckout(orderSheet: OrderSheetByIdResponse) {
  const { orderSheetItems, orderSheetId, deliveryAddress } = orderSheet;

  const { data: defaultAddress } = useDefaultAddressQuery({ deliveryAddress });
  const { deliveryMessage } = useDeliveryMessage();
  const { isAllCheckedAgreement } = useCheckoutAgreement();
  const { totalPrice, totalPriceWithDeliveryFee, orderName } =
    createOrderSheetSummary(orderSheetItems);
  const { requestTossPayments } = useTossPayments();
  const {
    isModalOpen,
    modalView,
    addressModalTitle,
    toggleModal,
    switchToFormView,
    closeModal,
  } = useAddressModal(defaultAddress);

  const { mutate: mutateOrderItems, isPending: isMutatingOrderItems } =
    useOrderItemsMutation();

  const handlePayment = () => {
    const payload = {
      orderSheetId,
      userAddressId: defaultAddress.addressId,
      deliveryAddress: {
        message: deliveryMessage,
      },
      termsAgreed: isAllCheckedAgreement,
    };

    mutateOrderItems(payload, {
      onSuccess: (response: PaymentsResponse) => {
        requestTossPayments({
          ...response,
          orderName,
          amount: totalPriceWithDeliveryFee,
        });
      },
    });
  };

  return {
    defaultAddress,
    orderProducts: orderSheetItems,
    totalPrice,
    totalPriceWithDeliveryFee,
    isAllCheckedAgreement,

    isModalOpen,
    modalView,
    addressModalTitle,
    toggleModal,
    switchToFormView,
    closeModal,

    isMutatingOrderItems,
    handlePayment,
  };
}
