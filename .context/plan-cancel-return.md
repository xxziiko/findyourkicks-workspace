
# 주문 취소/교환/반품 기능 설계 문서

이 문서는 FindYourKicks 쇼핑몰의 주문 취소, 교환, 반품 기능에 대한 상세 설계를 다룹니다.

## 1. 기능 범위

### 1.1. 법적 및 정책적 근거
- **청약철회권**: 전자상거래 등에서의 소비자보호에 관한 법률에 따라, 소비자는 상품을 공급받은 날로부터 7일 이내에 청약철회(반품/환불)가 가능합니다. 배송 전 단계에서도 취소가 가능해야 합니다.
- **기능 분리**:
    - **주문 취소**: 사용자가 결제를 완료했으나, 판매자가 상품을 발송하기 전(주로 '결제완료' 또는 '배송준비' 상태)에 주문을 철회하는 경우.
    - **반품**: 사용자가 상품을 수령한 후, 7일 이내에 환불을 목적으로 상품을 반송하는 경우.
    - **교환**: 사용자가 상품을 수령한 후, 사이즈나 색상 등의 이유로 다른 상품으로 교환을 원하는 경우.

### 1.2. 상태별 플로우
- **결제 전 취소**: 현재 시스템은 별도의 결제 전 상태를 관리하지 않으므로, 이번 설계 범위에서 제외합니다. (주문서 생성 후 이탈은 자동 소멸)
- **결제 후 취소 (배송 전)**:
    - `paid` (결제완료) 상태에서 사용자가 '주문 취소' 요청.
    - 시스템은 즉시 Toss Payments 결제 취소 API를 호출하고, 취소 성공 시 `orders.status`를 `cancelled`로 변경하고, `increase_stock` RPC를 호출하여 재고를 복원합니다.
- **반품/교환 (배송 후)**:
    - `delivered` (배송완료) 상태에서 7일 이내에 사용자가 '반품 신청' 또는 '교환 신청' 요청.
    - **1단계 (요청)**: 사용자는 사유를 입력하여 반품/교환을 요청. `orders.status`는 `return_requested` 또는 `exchange_requested`로 변경.
    - **2단계 (승인/거부)**: 관리자가 Admin 페이지에서 요청을 검토하고 승인 또는 거부. 승인 시 `return_approved` / `exchange_approved`로 변경.
    - **3단계 (상품 수거)**: 관리자가 반송 상품의 수거를 확인. (별도 시스템 연동 없이 수동 처리)
    - **4단계 (환불/재발송)**:
        - **반품**: 상품 수거 및 상태 확인 후, 관리자가 환불 처리. Toss Payments 결제 취소 API 호출, `orders.status`는 `returned`로 변경, 재고 복원.
        - **교환**: 상품 수거 확인 후, 관리자가 교환 상품 재발송. `orders.status`는 `shipped_again`으로 변경.

---

## 2. DB 변경사항

### 2.1. `orders` 테이블 구조 분석 및 변경
기존 `orders` 테이블은 `status` 컬럼을 통해 주문 상태를 관리합니다. 현재 `paid`, `preparing`, `shipping`, `delivered` 등의 상태를 사용하고 있습니다.

- **`orders.status` 컬럼 확장**:
    - 기존 텍스트 타입의 `status` 컬럼에 다음 상태들을 추가합니다.
    - **취소**: `cancel_requested` (취소 요청), `cancelled` (취소 완료)
    - **반품**: `return_requested` (반품 요청), `return_approved` (반품 승인), `returned` (반품 완료/환불)
    - **교환**: `exchange_requested` (교환 요청), `exchange_approved` (교환 승인), `shipped_again` (교환 상품 재발송)

### 2.2. 신규 테이블
주문 상태 변경의 이력을 관리하고, 취소/반품 사유 등을 저장하기 위해 별도 테이블을 생성합니다.

- **`order_cancellations`**: 주문 취소 요청 기록
    ```sql
    CREATE TABLE public.order_cancellations (
        cancellation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES public.orders(order_id),
        reason TEXT,
        requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        status TEXT NOT NULL DEFAULT 'requested' -- requested, completed, rejected
    );
    ALTER TABLE public.order_cancellations ENABLE ROW LEVEL SECURITY;
    ```

- **`order_returns`**: 반품 및 교환 요청 기록
    ```sql
    CREATE TABLE public.order_returns (
        return_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES public.orders(order_id),
        return_type TEXT NOT NULL, -- 'return' or 'exchange'
        reason TEXT NOT NULL,
        details TEXT,
        requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        status TEXT NOT NULL DEFAULT 'requested' -- requested, approved, rejected, completed
    );
    ALTER TABLE public.order_returns ENABLE ROW LEVEL SECURITY;
    ```

### 2.3. Supabase RPC 추가
재고 복원을 위한 RPC 함수를 추가합니다.

- **`increase_stock`**: 취소/반품 시 감소했던 재고를 다시 늘립니다.
    ```sql
    -- decrease_stock의 역함수
    CREATE OR REPLACE FUNCTION increase_stock(p_product_id UUID, p_size TEXT, p_quantity INT)
    RETURNS VOID AS $$
    BEGIN
      UPDATE product_inventory
      SET stock = stock + p_quantity
      WHERE product_id = p_product_id AND size = p_size;
    END;
    $$ LANGUAGE plpgsql;
    ```

### 2.4. 마이그레이션 파일 예시 (`supabase/migrations/YYYYMMDDHHMMSS_add_cancel_return_flow.sql`)
```sql
-- 1. New tables for cancellations and returns
CREATE TABLE public.order_cancellations (
    cancellation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(order_id),
    reason TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'requested'
);
COMMENT ON TABLE public.order_cancellations IS 'Logs order cancellation requests.';

CREATE TABLE public.order_returns (
    return_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(order_id),
    return_type TEXT NOT NULL, -- 'return' or 'exchange'
    reason TEXT NOT NULL,
    details TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'requested'
);
COMMENT ON TABLE public.order_returns IS 'Logs order return and exchange requests.';

-- 2. RLS policies for new tables
ALTER TABLE public.order_cancellations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to read their own cancellation requests"
ON public.order_cancellations FOR SELECT
USING (auth.uid() = (SELECT user_id FROM public.orders WHERE order_id = order_cancellations.order_id));

ALTER TABLE public.order_returns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to read their own return requests"
ON public.order_returns FOR SELECT
USING (auth.uid() = (SELECT user_id FROM public.orders WHERE order_id = order_returns.order_id));

-- 3. New RPC for increasing stock
CREATE OR REPLACE FUNCTION increase_stock(p_product_id UUID, p_size TEXT, p_quantity INT)
RETURNS VOID AS $$
BEGIN
  UPDATE product_inventory
  SET stock = stock + p_quantity
  WHERE product_id = p_product_id AND size = p_size;
END;
$$ LANGUAGE plpgsql;
```

---

## 3. API 설계

### 3.1. `POST /api/orders/[orderId]/cancel`
- **설명**: 주문 취소를 요청합니다.
- **요청 본문**:
    ```json
    {
      "reason": "단순 변심"
    }
    ```
- **로직**:
    1. 사용자 인증 및 주문 소유권 확인.
    2. `orders` 테이블에서 `orderId`로 주문 조회. `status`가 'paid' 또는 'preparing'인지 확인.
    3. `payments` 테이블에서 `payment_key` 조회.
    4. **Toss Payments 결제 취소 API 호출**:
        - `POST https://api.tosspayments.com/v1/payments/{paymentKey}/cancel`
        - Headers: `Authorization: Basic {BASE64_ENCODED_SECRET_KEY}`
        - Body: `{"cancelReason": "고객 취소"}`
    5. API 호출 성공 시:
        - `orders` 테이블의 `status`를 `cancelled`로 업데이트.
        - `order_cancellations` 테이블에 기록.
        - `order_items` 조회 후, 각 상품에 대해 `increase_stock` RPC 호출.
    6. 성공 응답 반환.

### 3.2. `POST /api/orders/[orderId]/return`
- **설명**: 반품 또는 교환을 요청합니다.
- **요청 본문**:
    ```json
    {
      "returnType": "return", // "return" or "exchange"
      "reason": "상품 불량",
      "details": "상품에 흠집이 있습니다."
    }
    ```
- **로직**:
    1. 사용자 인증 및 주문 소유권 확인.
    2. `orders` 테이블에서 `orderId`로 주문 조회. `status`가 'delivered'이고, 배송완료 후 7일이 지나지 않았는지 확인.
    3. `order_returns` 테이블에 요청 내용 기록.
    4. `orders` 테이블의 `status`를 `return_requested` 또는 `exchange_requested`로 업데이트.
    5. 성공 응답 반환 (관리자 승인 대기).

### 3.3. `GET /api/orders/[orderId]` 확장
- 기존 응답에 취소/반품 관련 정보를 추가합니다.
- `order_cancellations` 또는 `order_returns` 테이블을 JOIN하여 관련 요청 데이터를 포함시킵니다.
- **수정된 응답 예시**:
    ```json
    {
      "orderId": "...",
      "status": "cancelled",
      // ... 기존 필드
      "cancellationInfo": {
        "reason": "단순 변심",
        "requestedAt": "..."
      }
    }
    ```

---

## 4. 프론트엔드 설계

### 4.1. 주문 상세 페이지 (`/my/orders/[orderId]`)
- **파일**: `apps/shop/src/features/order/components/OrderDetail.tsx`
- **변경사항**:
    - 주문 상태(`order.status`)와 주문 날짜(`order.orderDate`)에 따라 버튼을 조건부 렌더링합니다.
    - `status === 'paid' || status === 'preparing'`: '주문 취소' 버튼 표시.
    - `status === 'delivered'` 이고 `orderDate`로부터 7일 이내: '반품/교환 신청' 버튼 표시.
    - `cancelled`, `return_requested` 등 새로운 상태에 대한 텍스트를 `STATUS_MAP`에 추가합니다.

### 4.2. 신규 컴포넌트 및 훅
- **`CancelRequestModal.tsx`**:
    - '주문 취소' 버튼 클릭 시 나타나는 확인 모달.
    - `useCancelOrderMutation`을 호출하여 API 요청.
- **`ReturnRequestForm.tsx`**:
    - '반품/교환 신청' 버튼 클릭 시 나타나는 모달 또는 별도 페이지.
    - 반품/교환 타입 선택(Radio), 사유 선택(Dropdown), 상세 사유 입력(Textarea) 폼 포함.
    - `useReturnOrderMutation`을 호출하여 API 요청.
- **`useCancelOrderMutation.ts`**:
    - `@tanstack/react-query`의 `useMutation`을 사용하여 `POST /api/orders/[orderId]/cancel` API를 호출하는 훅.
- **`useReturnOrderMutation.ts`**:
    - `useMutation`을 사용하여 `POST /api/orders/[orderId]/return` API를 호출하는 훅.

### 4.3. 주문 이력 목록 (`/my/orders`)
- **파일**: `apps/shop/src/features/order/components/OrderHistoryList.tsx`
- **변경사항**:
    - 각 주문 아이템에 현재 `status`를 텍스트로 표시. (예: '취소 완료', '반품 요청 중')

---

## 5. 관리자 기능

- **필요성**: 사용자의 취소/반품/교환 요청을 처리(승인/거부)하고, 후속 조치(환불, 재고 복원, 재발송)를 실행하기 위한 관리자 기능이 필수적입니다.
- **플로우**:
    1. 관리자 대시보드에 '주문 관리' 메뉴 추가.
    2. '취소/반품/교환 요청' 목록 페이지에서 모든 요청을 확인.
    3. 요청 상세 페이지에서 '승인' 또는 '거부' 처리.
    4. '승인' 시, 시스템은 상태를 변경하고 환불 API 호출 등의 자동화된 작업을 수행하거나, 관리자에게 수동 작업을 안내.
- **Admin API 확장**:
    - `GET /api/admin/returns`: 모든 반품/교환 요청 목록 조회.
    - `POST /api/admin/returns/[returnId]/approve`: 반품/교환 요청 승인. 이 API는 결제 취소, 재고 복원 등의 로직을 트리거.
    - `POST /api/admin/returns/[returnId]/reject`: 요청 거부.

---

## 6. 구현 순서 및 예상 파일 목록

### 6.1. 구현 순서
1.  **DB & Backend (Supabase)**:
    - `order_cancellations`, `order_returns` 테이블 생성 및 RLS 설정.
    - `increase_stock` RPC 함수 작성.
    - 마이그레이션 파일 작성.
2.  **Backend (Next.js API)**:
    - `POST /api/orders/[orderId]/cancel` 엔드포인트 구현 (Toss Payments 연동 포함).
    - `POST /api/orders/[orderId]/return` 엔드포인트 구현.
    - `GET /api/orders/[orderId]` 응답 확장.
3.  **Frontend (React)**:
    - `useCancelOrderMutation`, `useReturnOrderMutation` 훅 작성.
    - `CancelRequestModal`, `ReturnRequestForm` 컴포넌트 작성.
    - 주문 상세 및 목록 페이지에 조건부 UI 및 상태 표시 로직 추가.
4.  **Admin**:
    - 관리자용 API 엔드포인트 구현.
    - 관리자 페이지에서 요청 목록 및 처리 UI 구현.

### 6.2. 파일 목록
- **생성 (Created)**:
    - `supabase/migrations/YYYYMMDDHHMMSS_add_cancel_return_flow.sql`
    - `apps/shop/src/features/order/components/CancelRequestModal.tsx`
    - `apps/shop/src/features/order/components/ReturnRequestForm.tsx`
    - `apps/shop/src/features/order/hooks/mutations/useCancelOrderMutation.ts`
    - `apps/shop/src/features/order/hooks/mutations/useReturnOrderMutation.ts`
    - `app/api/orders/[orderId]/cancel/route.ts`
    - `app/api/orders/[orderId]/return/route.ts`
    - `app/api/admin/returns/route.ts` (and sub-routes)
- **수정 (Modified)**:
    - `apps/shop/src/app/api/orders/[orderId]/route.ts`
    - `apps/shop/src/features/order/components/OrderDetail.tsx`
    - `apps/shop/src/features/order/components/OrderHistoryList.tsx`
    - `apps/shop/src/features/order/api/getOrderById.ts` (Zod 스키마 확장)
    - `apps/admin/**` (관련 관리자 페이지 파일들)
