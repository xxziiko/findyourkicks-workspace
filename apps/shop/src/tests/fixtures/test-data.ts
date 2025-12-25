/**
 * Test Data Fixtures
 *
 * 역할:
 * - 테스트에 필요한 모든 더미 데이터를 중앙에서 관리
 * - 데이터 중복 방지 및 일관성 유지
 * - 환경별로 다른 데이터 사용 가능 (local vs CI)
 *
 * 사용 이유:
 * - 하드코딩 방지: 테스트 코드 곳곳에 흩어진 데이터 제거
 * - 유지보수 용이: 한 곳만 수정하면 모든 테스트에 반영
 * - 동적 생성: 병렬 테스트 시 데이터 충돌 방지
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * 테스트 사용자 정보
 * - 실제 존재하는 테스트 계정 정보
 * - 환경 변수로 관리 권장
 */
export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_ACCOUNT_PW || 'test123!',
  name: '테스트유저',
  phoneNumber: '010-1234-5678',
} as const;

/**
 * 테스트 주문서 데이터
 *
 * 주문서는 order-sheet.setup.ts에서 자동으로 생성됩니다.
 * Setup 스크립트가 생성한 주문서 ID를 .test-order-sheet-id 파일에서 읽어옵니다.
 *
 * 우선순위:
 * 1. .test-order-sheet-id 파일에 저장된 ID (Setup 스크립트가 생성)
 * 2. TEST_ORDER_SHEET_ID 환경 변수
 * 3. 기본값 (에러 방지용)
 */
const getTestOrderSheetId = (): string => {
  try {
    // 1. Setup 스크립트가 생성한 ID 파일 읽기
    const filePath = path.join(
      process.cwd(),
      'apps',
      'shop',
      '.test-order-sheet-id',
    );
    if (fs.existsSync(filePath)) {
      const id = fs.readFileSync(filePath, 'utf-8').trim();
      if (id) {
        return id;
      }
    }
  } catch (error) {
    // 파일이 없거나 읽기 실패 시 환경 변수로 fallback
  }

  // 2. 환경 변수
  if (process.env.TEST_ORDER_SHEET_ID) {
    return process.env.TEST_ORDER_SHEET_ID;
  }

  // 3. 기본값 (Setup 스크립트 실행 필요 경고)
  console.warn(
    '[TEST] No test order sheet ID found. Please run setup script: playwright test --project=shop-setup',
  );
  return 'SETUP_REQUIRED';
};

export const createTestOrderSheet = () => ({
  orderSheetId: getTestOrderSheetId(),
  totalAmount: 15000,
  deliveryFee: 3000,
  totalPriceWithDeliveryFee: 18000,
});

/**
 * 테스트 결제 데이터
 */
export const TEST_PAYMENT = {
  /**
   * Toss Payments Mock용 결제 키 생성
   */
  createMockPaymentKey: () => `mock_payment_key_${Date.now()}`,

  /**
   * 카드 결제 정보
   * 주의: Toss SDK Mock을 사용하므로 실제 카드 번호 불필요
   */
  CARD: {
    method: 'CARD',
    cardNumber: '4000000000000001', // 참고용 (Mock에서는 사용 안 함)
    expiry: '12/25',
    cvc: '123',
    owner: 'HONG GILDONG',
  },

  /**
   * 가상계좌 정보
   */
  VIRTUAL_ACCOUNT: {
    method: 'VIRTUAL_ACCOUNT',
    bank: '국민은행',
    accountNumber: '1234567890',
  },
} as const;

/**
 * 테스트 주문 데이터 생성
 */
export const createTestOrder = () => ({
  orderId: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  orderName: '테스트 주문',
  paymentKey: `test_payment_${Date.now()}`,
  amount: 18000,
  status: 'COMPLETED',
  orderDate: new Date().toISOString(),
});

/**
 * 테스트 배송지 정보
 */
export const TEST_ADDRESS = {
  name: '홍길동',
  phoneNumber: '010-1234-5678',
  address: '서울시 강남구 테헤란로 123',
  detailAddress: '1층',
  zipCode: '06234',
  message: '문 앞에 놔주세요',
} as const;

/**
 * 테스트 상품 데이터 생성
 * - E2E 테스트에서는 실제 DB의 상품을 사용하는 것을 권장
 * - 필요 시 테스트용 상품을 미리 DB에 seed
 */
export const createTestProduct = () => ({
  productId: `product-${Date.now()}`,
  name: `테스트 신발 ${Date.now()}`,
  price: 89000,
  brand: 'Nike',
  size: '270',
  quantity: 1,
  imageUrl: 'https://via.placeholder.com/300',
});

/**
 * Toss 에러 코드 (실제 Toss API 문서 기반)
 */
export const TOSS_ERROR_CODES = {
  USER_CANCEL: {
    code: 'USER_CANCEL',
    message: '사용자가 결제를 취소했습니다',
  },
  EXCEED_CARD_LIMIT: {
    code: 'EXCEED_CARD_LIMIT',
    message: '한도를 초과했습니다',
  },
  INVALID_CARD_EXPIRATION: {
    code: 'INVALID_CARD_EXPIRATION',
    message: '카드 유효기간이 만료되었습니다',
  },
  INSUFFICIENT_BALANCE: {
    code: 'INSUFFICIENT_BALANCE',
    message: '잔액이 부족합니다',
  },
  PROVIDER_ERROR: {
    code: 'PROVIDER_ERROR',
    message: '일시적인 오류가 발생했습니다',
  },
} as const;

/**
 * API 엔드포인트
 * - 테스트에서 사용하는 API 경로 중앙 관리
 */
export const TEST_API_ENDPOINTS = {
  ORDERS: '/api/orders',
  PAYMENTS: '/api/payments',
  CART: '/api/cart/items',
  ADDRESS: '/api/users/addresses',
} as const;

/**
 * 페이지 경로
 */
export const TEST_PAGES = {
  HOME: '/',
  CART: '/cart',
  CHECKOUT: (orderSheetId: string) => `/checkout/${orderSheetId}`,
  CONFIRM: '/confirm',
  COMPLETE: (orderId: string) => `/complete/${orderId}`,
  FAIL: '/fail',
  MY_ORDERS: '/my/orders',
} as const;

/**
 * 테스트 시나리오별 대기 시간 (ms)
 * - Flaky test 방지를 위한 적절한 timeout 값
 */
export const TEST_TIMEOUTS = {
  SHORT: 5000, // 빠른 응답 기대 (버튼 클릭 등)
  MEDIUM: 15000, // 일반 API 응답
  LONG: 30000, // 페이지 전환, 리다이렉트
  VERY_LONG: 60000, // 복잡한 처리 (실제 결제 등, 통합 테스트 전용)
} as const;

/**
 * 헬퍼 함수: 랜덤 문자열 생성
 */
export const generateRandomString = (length = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

/**
 * 헬퍼 함수: 고유 타임스탬프 ID 생성
 */
export const generateUniqueId = (prefix = 'test') => {
  return `${prefix}-${Date.now()}-${generateRandomString(6)}`;
};
