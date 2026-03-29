export const STATUS_MAP: Record<string, string> = {
  paid: '결제완료',
  preparing: '배송준비',
  shipping: '배송중',
  delivered: '배송완료',
  cancelled: '주문취소',
  cancel_requested: '취소신청',
  return_requested: '반품신청',
  return_approved: '반품승인',
  returned: '반품완료',
  exchange_requested: '교환신청',
  exchange_approved: '교환승인',
  shipped_again: '재발송',
};

export function canCancel(status: string): boolean {
  return status === 'paid' || status === 'preparing';
}

/** delivered 상태에서만 호출하세요. 주문일로부터 7일 이내 여부를 반환합니다. */
export function canReturn(orderDate: string, now: Date = new Date()): boolean {
  return (
    now.getTime() - new Date(orderDate).getTime() <= 7 * 24 * 60 * 60 * 1000
  );
}
