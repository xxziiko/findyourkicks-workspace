'use client';

import { useOrderItemsMutation } from '@/features/order';
import type { OrderSheetByIdResponse } from '@/features/order-sheet/types';
import { addressQueries } from '@/features/user/address';
import { deliveryMessageAtom, isAllCheckedAgreementAtom } from '@/lib/store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

export default function useCheckout(orderSheet: OrderSheetByIdResponse) {
  const { orderSheetItems, orderSheetId, deliveryAddress } = orderSheet;
  const { data: defaultAddress } = useSuspenseQuery(
    addressQueries.default(deliveryAddress),
  );

  const deliveryMessage = useAtomValue(deliveryMessageAtom);
  const isAllCheckedAgreement = useAtomValue(isAllCheckedAgreementAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<'form' | 'list'>(
    defaultAddress.addressId ? 'list' : 'form',
  );

  const itemPrices = orderSheetItems.map((item) => item.price * item.quantity);
  const totalPrice = itemPrices.reduce((acc, price) => acc + price, 0);
  const totalPriceWithDeliveryFee = totalPrice + 3000;
  const title = modalView === 'form' ? '주소 입력' : '주소 변경';

  const restTossPaymentsPayload = {
    orderName:
      orderSheetItems.length === 1
        ? orderSheetItems[0].title
        : `${orderSheetItems[0].title} 외 ${orderSheetItems.length - 1}건`,
    amount: totalPriceWithDeliveryFee,
  };

  const { mutate: mutateOrderItems, isPending: isMutatingOrderItems } =
    useOrderItemsMutation({ restTossPaymentsPayload });

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
    title,
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
