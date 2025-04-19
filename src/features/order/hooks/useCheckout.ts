'use client';

import { useOrderItemsMutation } from '@/features/order';
import type { OrderSheetByIdResponse } from '@/features/order-sheet/types';
import { getOrderSheetSummary } from '@/features/order/hooks/getOrderSheetSummary';
import { addressQueries } from '@/features/user/address';
import { useCheckoutAgreement, useDeliveryMessage } from '@/shared/hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function useCheckout(orderSheet: OrderSheetByIdResponse) {
  const { orderSheetItems, orderSheetId, deliveryAddress } = orderSheet;
  const { data: defaultAddress } = useSuspenseQuery({
    ...addressQueries.default(),
    initialData: deliveryAddress,
  });

  const { deliveryMessage } = useDeliveryMessage();
  const { isAllCheckedAgreement } = useCheckoutAgreement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<'form' | 'list'>(
    defaultAddress.addressId ? 'list' : 'form',
  );
  const { totalPrice, totalPriceWithDeliveryFee, orderName } =
    getOrderSheetSummary(orderSheetItems);

  const addressModalTitle = modalView === 'form' ? '주소 입력' : '주소 변경';

  const paymentSummary = {
    orderName,
    amount: totalPriceWithDeliveryFee,
  };

  const { mutate: mutateOrderItems, isPending: isMutatingOrderItems } =
    useOrderItemsMutation({ paymentSummary });

  const handlePayment = () => {
    mutateOrderItems({
      orderSheetId,
      userAddressId: defaultAddress.addressId,
      deliveryAddress: {
        message: deliveryMessage,
      },
      termsAgreed: isAllCheckedAgreement,
    });
  };

  const handleModal = () => setIsModalOpen((prev) => !prev);
  const handleModalView = () => setModalView('form');

  const onCloseModal = () => {
    handleModal();
    setModalView(defaultAddress.addressId ? 'list' : 'form');
  };

  return {
    defaultAddress,
    orderProducts: orderSheetItems,
    addressModalTitle,
    totalPrice,
    totalPriceWithDeliveryFee,
    isModalOpen,
    isAllCheckedAgreement,
    isMutatingOrderItems,
    modalView,
    handleModal,
    handlePayment,
    handleModalView,
    onCloseModal,
  };
}
