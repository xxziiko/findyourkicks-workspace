import * as fs from 'node:fs';
import * as path from 'node:path';

export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_ACCOUNT_PW || 'test123!',
  name: '테스트유저',
  phoneNumber: '010-1234-5678',
} as const;

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

export const TEST_PAYMENT = {
  createMockPaymentKey: () => `mock_payment_key_${Date.now()}`,

  CARD: {
    method: 'CARD',
    cardNumber: '4000000000000001', // 참고용 (Mock에서는 사용 안 함)
    expiry: '12/25',
    cvc: '123',
    owner: 'HONG GILDONG',
  },

  VIRTUAL_ACCOUNT: {
    method: 'VIRTUAL_ACCOUNT',
    bank: '국민은행',
    accountNumber: '1234567890',
  },
} as const;

export const createTestOrder = () => ({
  orderId: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  orderName: '테스트 주문',
  paymentKey: `test_payment_${Date.now()}`,
  amount: 18000,
  status: 'COMPLETED',
  orderDate: new Date().toISOString(),
});

export const TEST_ADDRESS = {
  name: '홍길동',
  phoneNumber: '010-1234-5678',
  address: '서울시 강남구 테헤란로 123',
  detailAddress: '1층',
  zipCode: '06234',
  message: '문 앞에 놔주세요',
} as const;

export const createTestProduct = () => ({
  productId: `product-${Date.now()}`,
  name: `테스트 신발 ${Date.now()}`,
  price: 89000,
  brand: 'Nike',
  size: '270',
  quantity: 1,
  imageUrl: 'https://via.placeholder.com/300',
});

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

export const TEST_API_ENDPOINTS = {
  ORDERS: '/api/orders',
  PAYMENTS: '/api/payments',
  CART: '/api/cart/items',
  ADDRESS: '/api/users/addresses',
} as const;

export const TEST_PAGES = {
  HOME: '/',
  CART: '/cart',
  CHECKOUT: (orderSheetId: string) => `/checkout/${orderSheetId}`,
  CONFIRM: '/confirm',
  COMPLETE: (orderId: string) => `/complete/${orderId}`,
  FAIL: '/fail',
  MY_ORDERS: '/my/orders',
} as const;

export const TEST_TIMEOUTS = {
  SHORT: 5000, // 빠른 응답 기대 (버튼 클릭 등)
  MEDIUM: 15000, // 일반 API 응답
  LONG: 30000, // 페이지 전환, 리다이렉트
  VERY_LONG: 60000, // 복잡한 처리 (실제 결제 등, 통합 테스트 전용)
} as const;

export const generateRandomString = (length = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

export const generateUniqueId = (prefix = 'test') => {
  return `${prefix}-${Date.now()}-${generateRandomString(6)}`;
};
