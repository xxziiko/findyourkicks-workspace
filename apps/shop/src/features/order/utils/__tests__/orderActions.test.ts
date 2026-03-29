import { describe, expect, it } from 'vitest';
import { STATUS_MAP, canCancel, canReturn } from '../orderActions';

// ---------------------------------------------------------------------------
// Pure logic extracted from OrderDetail.tsx
//
// canCancel: status가 'paid' 또는 'preparing'일 때만 true
// canReturn: status='delivered' 이고 orderDate로부터 7일 이내일 때 true
//            now 파라미터로 시간을 고정해 Date.now() 의존 없이 테스트
// ---------------------------------------------------------------------------

describe('canCancel', () => {
  it('returns true when status is paid', () => {
    expect(canCancel('paid')).toBe(true);
  });

  it('returns true when status is preparing', () => {
    expect(canCancel('preparing')).toBe(true);
  });

  it('returns false when status is shipping', () => {
    expect(canCancel('shipping')).toBe(false);
  });

  it('returns false when status is delivered', () => {
    expect(canCancel('delivered')).toBe(false);
  });

  it('returns false when status is cancelled', () => {
    expect(canCancel('cancelled')).toBe(false);
  });

  it('returns false when status is return_requested', () => {
    expect(canCancel('return_requested')).toBe(false);
  });
});

describe('canReturn', () => {
  // now를 고정해 결정론적 테스트 보장
  const NOW = new Date('2024-06-10T12:00:00Z');

  it('returns true when order is 0 days old (same day)', () => {
    const orderDate = '2024-06-10T08:00:00Z';
    expect(canReturn(orderDate, NOW)).toBe(true);
  });

  it('returns true when order is exactly 3 days old', () => {
    const orderDate = '2024-06-07T12:00:00Z';
    expect(canReturn(orderDate, NOW)).toBe(true);
  });

  it('returns true when order is exactly 7 days old (boundary)', () => {
    const orderDate = '2024-06-03T12:00:00Z';
    expect(canReturn(orderDate, NOW)).toBe(true);
  });

  it('returns false when order is 8 days old (expired)', () => {
    const orderDate = '2024-06-02T12:00:00Z';
    expect(canReturn(orderDate, NOW)).toBe(false);
  });

  it('returns false when order is 30 days old', () => {
    const orderDate = '2024-05-11T12:00:00Z';
    expect(canReturn(orderDate, NOW)).toBe(false);
  });

  it('uses current time when now parameter is omitted', () => {
    // 현재 시각 기준으로 방금 생성된 주문 → 항상 true
    const justNow = new Date().toISOString();
    expect(canReturn(justNow)).toBe(true);
  });
});

describe('STATUS_MAP', () => {
  it('maps known statuses to Korean labels', () => {
    expect(STATUS_MAP['paid']).toBe('결제완료');
    expect(STATUS_MAP['preparing']).toBe('배송준비');
    expect(STATUS_MAP['shipping']).toBe('배송중');
    expect(STATUS_MAP['delivered']).toBe('배송완료');
    expect(STATUS_MAP['cancelled']).toBe('주문취소');
    expect(STATUS_MAP['cancel_requested']).toBe('취소신청');
    expect(STATUS_MAP['return_requested']).toBe('반품신청');
    expect(STATUS_MAP['return_approved']).toBe('반품승인');
    expect(STATUS_MAP['returned']).toBe('반품완료');
    expect(STATUS_MAP['exchange_requested']).toBe('교환신청');
    expect(STATUS_MAP['exchange_approved']).toBe('교환승인');
    expect(STATUS_MAP['shipped_again']).toBe('재발송');
  });

  it('returns undefined for unknown status', () => {
    expect(STATUS_MAP['unknown_status']).toBeUndefined();
  });
});
