'use client';

import type { OrderSheetByIdResponse } from '@/features/order-sheet/types';
import { requestPayments } from '@/features/payment/apis';
import { fetchDefaultUserAddress } from '@/features/user/address/apis';
import { deliveryMessageAtom, isAllCheckedAgreementAtom } from '@/lib/store';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

interface TosspaymentsPayload {
  orderId: string;
  orderName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerMobilePhone: string;
}

export default function useCheckout(orderSheet: OrderSheetByIdResponse) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deliveryMessage = useAtomValue(deliveryMessageAtom);
  const isAllCheckedAgreement = useAtomValue(isAllCheckedAgreementAtom);
  const { orderSheetItems } = orderSheet;

  const totalPrice = orderSheet.orderSheetItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalPriceWithDeliveryFee = totalPrice + 3000;

  const { data: defaultAddress } = useSuspenseQuery({
    queryKey: ['defaultAddress'],
    initialData: orderSheet.deliveryAddress,
    queryFn: fetchDefaultUserAddress,
  });

  const [modalView, setModalView] = useState<'form' | 'list'>(
    defaultAddress.addressId ? 'list' : 'form',
  );
  const title = modalView === 'form' ? '주소 입력' : '주소 변경';

  // FIXME: 분리
  const { mutate: mutateOrderItems, isPending: isMutatingOrderItems } =
    useMutation({
      mutationFn: requestPayments,
      onSuccess: (response) => {
        requestTossPayments({
          ...response,
          orderName:
            orderSheetItems.length === 1
              ? orderSheetItems[0].title
              : `${orderSheetItems[0].title} 외 ${orderSheetItems.length - 1}건`,
          amount: totalPriceWithDeliveryFee,
        });
      },
    });

  const handlePayment = () => {
    mutateOrderItems({
      orderSheetId: orderSheet.orderSheetId,
      userAddressId: defaultAddress.addressId,
      deliveryAddress: {
        message: deliveryMessage,
      },
      termsAgreed: isAllCheckedAgreement,
    });
  };

  // ------  SDK 초기화 ------
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  const customerKey = orderSheet.orderSheetId;

  async function requestTossPayments({
    orderId,
    orderName,
    amount,
    customerEmail,
    customerName,
    customerMobilePhone,
  }: TosspaymentsPayload) {
    const tossPayments = await loadTossPayments(clientKey);
    const payment = tossPayments.payment({ customerKey });

    // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------

    await payment.requestPayment({
      method: 'CARD', // 카드 결제
      amount: {
        currency: 'KRW',
        value: amount,
      },
      orderId,
      orderName,
      customerEmail,
      customerMobilePhone,
      customerName,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/confirm`, // 결제 요청이 성공하면 리다이렉트되는 URL
      failUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/fail`, // 결제 요청이 실패하면 리다이렉트되는 URL

      // 카드 결제에 필요한 정보
      card: {
        useCardPoint: false,
        useAppCardOnly: false,
      },
    });
  }

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
