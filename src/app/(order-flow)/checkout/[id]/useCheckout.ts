import type { OrderSheetResponse } from '@/app/api/checkout/[id]/route';
import { fetchDefaultUserAddress, requestPayments } from '@/lib/api';
import { deliveryMessageAtom, isAllCheckedAgreementAtom } from '@/lib/store';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

export interface RequestPaymentsPayload {
  orderSheetId: string;
  userAddressId: string;
  delivery?: {
    alias?: string;
    receiverName?: string;
    receiverPhone?: string;
    address?: string;
    message?: string;
  };
  termsAgreed: boolean;
}

interface TosspaymentsPayload {
  orderId: string;
  orderName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerMobilePhone: string;
}

export default function useCheckout(orderSheet: OrderSheetResponse) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deliveryMessage = useAtomValue(deliveryMessageAtom);
  const isAllCheckedAgreement = useAtomValue(isAllCheckedAgreementAtom);
  const [modalView, setModalView] = useState<'form' | 'list'>(
    orderSheet.delivery.addressId ? 'list' : 'form',
  );
  const title = modalView === 'form' ? '주소 입력' : '주소 변경';

  const totalPrice = orderSheet.orderSheetItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalPriceWithDeliveryFee = totalPrice + 3000;

  const { data: defaultAddress } = useSuspenseQuery({
    queryKey: ['defaultAddress'],
    initialData: orderSheet.delivery,
    queryFn: fetchDefaultUserAddress,
  });

  const { mutate: mutateOrderItems, isPending: isMutatingOrderItems } =
    useMutation({
      mutationFn: requestPayments,
      onSuccess: (response) => {
        const paymentRequestBody = {
          ...response,
          orderName:
            orderSheet.orderSheetItems.length === 1
              ? orderSheet.orderSheetItems[0].title
              : `${orderSheet.orderSheetItems[0].title} 외 ${orderSheet.orderSheetItems.length - 1}건`,
          amount: totalPriceWithDeliveryFee,
        };

        requestTossPayments(paymentRequestBody);
      },
    });

  const handlePayment = () => {
    const payload = {
      orderSheetId: orderSheet.orderSheetId,
      userAddressId: orderSheet.delivery.addressId,
      delivery: { message: deliveryMessage },
      termsAgreed: isAllCheckedAgreement,
    };

    mutateOrderItems(payload);
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
      successUrl: `${window.location.origin}/confirm`, // 결제 요청이 성공하면 리다이렉트되는 URL
      failUrl: `${window.location.origin}/fail`, // 결제 요청이 실패하면 리다이렉트되는 URL

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
    setModalView(orderSheet.delivery.addressId ? 'list' : 'form');
  };

  return {
    defaultAddress,
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
