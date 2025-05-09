import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

interface TosspaymentsPayload {
  orderId: string;
  orderName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerMobilePhone: string;
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

export function useTossPayments() {
  // ------  SDK 초기화 ------
  async function requestTossPayments({
    orderId,
    orderName,
    amount,
    customerEmail,
    customerName,
    customerMobilePhone,
  }: TosspaymentsPayload) {
    const customerKey = orderId;
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

  return {
    requestTossPayments,
  };
}
