import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useState } from 'react';
import { useCart } from '../cart/_features';

interface RequestPaymentParams {
  orderId: string;
  orderName: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerMobilePhone: string;
}

const MOCK_ADDRESS = {
  id: 0,
  alias: '우리집',
  name: '홍길동',
  phone: '010-1234-1234',
  address: '[13607] 경기도 성남시 분당구 백현로',
};

// const MOCK_ADDRESS = null;

export default function useCheckout() {
  const { cartItems } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const conditionalTitle = !MOCK_ADDRESS ? '주소 입력' : '주소 변경';

  const handleModal = () => setIsModalOpen((prev) => !prev);

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
    MOCK_ADDRESS,
    cartItems,
    isModalOpen,
    handleModal,
    requestPayment,
  };
}
