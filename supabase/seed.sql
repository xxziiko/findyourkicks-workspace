-- ==============================================
-- QA 테스트 시드 데이터
-- ==============================================
-- 멱등성: ON CONFLICT (pk) DO NOTHING
-- 상대 시간: NOW()-INTERVAL 사용 (하드코딩 없음)
-- user_id: auth.users에서 test@test.com 조회

-- -----------------------------------------------
-- 1. 상품 (products)
-- -----------------------------------------------
INSERT INTO public.products (product_id, title, price, image, status)
VALUES
  ('00000000-0000-0000-0001-000000000001', 'QA Test Shoe', 100000, 'https://example.com/qa-shoe.jpg', 'selling')
ON CONFLICT (product_id) DO NOTHING;

-- -----------------------------------------------
-- 2. 재고 (inventory)
-- -----------------------------------------------
INSERT INTO public.inventory (product_id, size, stock)
VALUES
  ('00000000-0000-0000-0001-000000000001', '270', 99)
ON CONFLICT (product_id, size) DO NOTHING;

-- -----------------------------------------------
-- 3. 배송지 (user_addresses)
-- -----------------------------------------------
INSERT INTO public.user_addresses (address_id, user_id, receiver_name, receiver_phone, address, message, is_default)
VALUES (
  '00000000-0000-0000-0002-000000000001',
  (SELECT id FROM auth.users WHERE email = 'test@test.com'),
  'QA 테스터',
  '010-0000-0000',
  '서울특별시 강남구 테스트로 1',
  '부재 시 경비실',
  TRUE
)
ON CONFLICT (address_id) DO NOTHING;

-- -----------------------------------------------
-- 4. 주문 (orders) — UUID 형식 order_id 사용
-- -----------------------------------------------
INSERT INTO public.orders (order_id, user_id, address_id, total_amount, status, order_date, tracking_number)
VALUES
  -- 취소 E2E용: paid 상태
  (
    '00000000-0000-0000-0004-000000000001',
    (SELECT id FROM auth.users WHERE email = 'test@test.com'),
    '00000000-0000-0000-0002-000000000001',
    100000,
    'paid',
    NOW() - INTERVAL '1 day',
    NULL
  ),
  -- 취소 E2E용: preparing 상태
  (
    '00000000-0000-0000-0004-000000000002',
    (SELECT id FROM auth.users WHERE email = 'test@test.com'),
    '00000000-0000-0000-0002-000000000001',
    100000,
    'preparing',
    NOW() - INTERVAL '2 days',
    NULL
  ),
  -- 반품 E2E용: 3일 전 delivered (기간 내)
  (
    '00000000-0000-0000-0004-000000000003',
    (SELECT id FROM auth.users WHERE email = 'test@test.com'),
    '00000000-0000-0000-0002-000000000001',
    100000,
    'delivered',
    NOW() - INTERVAL '3 days',
    'TRACK-RETURN-OK'
  ),
  -- 반품 불가 확인: 8일 전 delivered (기간 초과)
  (
    '00000000-0000-0000-0004-000000000004',
    (SELECT id FROM auth.users WHERE email = 'test@test.com'),
    '00000000-0000-0000-0002-000000000001',
    100000,
    'delivered',
    NOW() - INTERVAL '8 days',
    'TRACK-RETURN-EXP'
  ),
  -- 취소/반품 불가 확인: shipping 상태
  (
    '00000000-0000-0000-0004-000000000005',
    (SELECT id FROM auth.users WHERE email = 'test@test.com'),
    '00000000-0000-0000-0002-000000000001',
    100000,
    'shipping',
    NOW() - INTERVAL '3 days',
    'TRACK-SHIPPING'
  ),
  -- Admin 승인/거부용: return_requested 상태
  (
    '00000000-0000-0000-0004-000000000006',
    (SELECT id FROM auth.users WHERE email = 'test@test.com'),
    '00000000-0000-0000-0002-000000000001',
    100000,
    'return_requested',
    NOW() - INTERVAL '5 days',
    'TRACK-RETURN-REQ'
  ),
  -- Admin 교환 승인용: exchange_requested 상태
  (
    '00000000-0000-0000-0004-000000000007',
    (SELECT id FROM auth.users WHERE email = 'test@test.com'),
    '00000000-0000-0000-0002-000000000001',
    100000,
    'exchange_requested',
    NOW() - INTERVAL '5 days',
    'TRACK-EXCHANGE'
  ),
  -- 리뷰 E2E용: 2일 전 delivered
  (
    '00000000-0000-0000-0004-000000000008',
    (SELECT id FROM auth.users WHERE email = 'test@test.com'),
    '00000000-0000-0000-0002-000000000001',
    100000,
    'delivered',
    NOW() - INTERVAL '2 days',
    'TRACK-REVIEW'
  )
ON CONFLICT (order_id) DO NOTHING;

-- -----------------------------------------------
-- 5. 결제 정보 (payments) — order_id 직접 포함
-- -----------------------------------------------
INSERT INTO public.payments (payment_id, payment_key, payment_method, payment_easypay_provider, amount, status, order_name, approved_at, order_id)
VALUES
  ('00000000-0000-0000-0003-000000000001', 'qa-pay-key-cancel-paid',      '간편결제', 'KakaoPay', 100000, 'DONE', 'QA Test Shoe', NOW() - INTERVAL '1 day',  '00000000-0000-0000-0004-000000000001'),
  ('00000000-0000-0000-0003-000000000002', 'qa-pay-key-cancel-prep',      '간편결제', 'KakaoPay', 100000, 'DONE', 'QA Test Shoe', NOW() - INTERVAL '2 days', '00000000-0000-0000-0004-000000000002'),
  ('00000000-0000-0000-0003-000000000003', 'qa-pay-key-return-ok',        '간편결제', 'KakaoPay', 100000, 'DONE', 'QA Test Shoe', NOW() - INTERVAL '4 days', '00000000-0000-0000-0004-000000000003'),
  ('00000000-0000-0000-0003-000000000004', 'qa-pay-key-return-expired',   '간편결제', 'KakaoPay', 100000, 'DONE', 'QA Test Shoe', NOW() - INTERVAL '9 days', '00000000-0000-0000-0004-000000000004'),
  ('00000000-0000-0000-0003-000000000005', 'qa-pay-key-shipping',         '간편결제', 'KakaoPay', 100000, 'DONE', 'QA Test Shoe', NOW() - INTERVAL '3 days', '00000000-0000-0000-0004-000000000005'),
  ('00000000-0000-0000-0003-000000000006', 'qa-pay-key-return-requested', '간편결제', 'KakaoPay', 100000, 'DONE', 'QA Test Shoe', NOW() - INTERVAL '5 days', '00000000-0000-0000-0004-000000000006'),
  ('00000000-0000-0000-0003-000000000007', 'qa-pay-key-exchange-req',     '간편결제', 'KakaoPay', 100000, 'DONE', 'QA Test Shoe', NOW() - INTERVAL '5 days', '00000000-0000-0000-0004-000000000007'),
  ('00000000-0000-0000-0003-000000000008', 'qa-pay-key-review-eligible',  '간편결제', 'KakaoPay', 100000, 'DONE', 'QA Test Shoe', NOW() - INTERVAL '3 days', '00000000-0000-0000-0004-000000000008')
ON CONFLICT (payment_id) DO NOTHING;

-- -----------------------------------------------
-- 6. 주문 아이템 (order_items) — 명시적 PK로 멱등성 보장
-- -----------------------------------------------
INSERT INTO public.order_items (order_item_id, order_id, product_id, size, quantity, price)
VALUES
  ('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0001-000000000001', '270', 1, 100000),
  ('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0001-000000000001', '270', 1, 100000),
  ('00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0004-000000000003', '00000000-0000-0000-0001-000000000001', '270', 1, 100000),
  ('00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0004-000000000004', '00000000-0000-0000-0001-000000000001', '270', 1, 100000),
  ('00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0004-000000000005', '00000000-0000-0000-0001-000000000001', '270', 1, 100000),
  ('00000000-0000-0000-0005-000000000006', '00000000-0000-0000-0004-000000000006', '00000000-0000-0000-0001-000000000001', '270', 1, 100000),
  ('00000000-0000-0000-0005-000000000007', '00000000-0000-0000-0004-000000000007', '00000000-0000-0000-0001-000000000001', '270', 1, 100000),
  ('00000000-0000-0000-0005-000000000008', '00000000-0000-0000-0004-000000000008', '00000000-0000-0000-0001-000000000001', '270', 1, 100000)
ON CONFLICT (order_item_id) DO NOTHING;

-- -----------------------------------------------
-- 7. 반품 요청 데이터 (order_returns) — 명시적 PK로 멱등성 보장
-- -----------------------------------------------
INSERT INTO public.order_returns (return_id, order_id, return_type, reason, details, status)
VALUES
  (
    '00000000-0000-0000-0006-000000000001',
    '00000000-0000-0000-0004-000000000006',
    'return',
    '상품 불량',
    '수령 시 박스 파손',
    'requested'
  ),
  (
    '00000000-0000-0000-0006-000000000002',
    '00000000-0000-0000-0004-000000000007',
    'exchange',
    '사이즈 교환',
    '270 → 275 교환 요청',
    'requested'
  ),
  -- 승인/거부 테스트 격리를 위한 추가 반품 요청
  (
    '00000000-0000-0000-0006-000000000003',
    '00000000-0000-0000-0004-000000000003',
    'return',
    '단순 변심',
    '색상이 사진과 다름',
    'requested'
  )
ON CONFLICT (return_id) DO NOTHING;
