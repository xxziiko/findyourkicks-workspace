import type { OrderSheetResponse } from '@/app/api/checkout/[id]/route';
import { isAllCheckedAgreementAtom } from '@/lib/store';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

interface RequestPaymentParams {
  orderId: string;
  orderName: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerMobilePhone: string;
}

const paymentRequestBody = {
  orderId: 'O_evBvXO_Ge2XwXA2xPtj', // 고유 주문번호
  orderName: '토스 티셔츠 외 2건',
  amount: 50000,
  customerEmail: 'customer123@gmail.com',
  customerName: '김토스',
  customerMobilePhone: '01012341234',
};

// const MOCK_ADDRESS = null;

export default function useCheckout(orderSheet: OrderSheetResponse) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAllCheckedAgreement = useAtomValue(isAllCheckedAgreementAtom);
  const conditionalTitle = !orderSheet.deliveryInfo ? '주소 입력' : '주소 변경';

  const handleModal = () => setIsModalOpen((prev) => !prev);

  const totalPrice = orderSheet.orderSheetItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const totalPriceWithDeliveryFee = totalPrice + 3000;

  // TODO: mutate orderItems

  const handlePayment = () => {
    // TODO: mutate response data
    requestPayment(paymentRequestBody);
  };

  // ------  SDK 초기화 ------
  const clientKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY;
  const customerKey = process.env.NEXT_PUBLIC_TOSS_CUSTOMER_KEY;

  async function requestPayment({
    orderId,
    orderName,
    amount,
    customerEmail,
    customerName,
    customerMobilePhone,
  }: RequestPaymentParams) {
    const tossPayments = await loadTossPayments(clientKey);
    const payment = tossPayments.payment({ customerKey });

    // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
    //TODO: 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.

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
      successUrl: `${window.location.origin}/complete`, // 결제 요청이 성공하면 리다이렉트되는 URL
      failUrl: `${window.location.origin}/fail`, // 결제 요청이 실패하면 리다이렉트되는 URL

      // 카드 결제에 필요한 정보
      card: {
        useCardPoint: false,
        useAppCardOnly: false,
      },
    });
  }

  return {
    conditionalTitle,
    totalPrice,
    totalPriceWithDeliveryFee,
    isModalOpen,
    isAllCheckedAgreement,
    handleModal,
    handlePayment,
  };
}
