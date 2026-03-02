-- ==============================================
-- 주문 취소 / 반품 / 교환 플로우
-- ==============================================

-- 1. 주문 취소 기록 테이블
CREATE TABLE IF NOT EXISTS public.order_cancellations (
    cancellation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(order_id) ON DELETE CASCADE,
    reason TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'completed', 'rejected'))
);

COMMENT ON TABLE public.order_cancellations IS '주문 취소 요청 기록';

-- 2. 반품/교환 기록 테이블
CREATE TABLE IF NOT EXISTS public.order_returns (
    return_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(order_id) ON DELETE CASCADE,
    return_type TEXT NOT NULL CHECK (return_type IN ('return', 'exchange')),
    reason TEXT NOT NULL,
    details TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'completed'))
);

COMMENT ON TABLE public.order_returns IS '반품 및 교환 요청 기록';

-- 3. RLS 활성화
ALTER TABLE public.order_cancellations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_returns ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책: 본인 주문의 취소 기록만 조회/삽입 가능
CREATE POLICY "users_read_own_cancellations"
ON public.order_cancellations FOR SELECT
USING (
  auth.uid() = (
    SELECT user_id FROM public.orders WHERE order_id = order_cancellations.order_id
  )
);

CREATE POLICY "users_insert_own_cancellations"
ON public.order_cancellations FOR INSERT
WITH CHECK (
  auth.uid() = (
    SELECT user_id FROM public.orders WHERE order_id = order_cancellations.order_id
  )
);

-- 5. RLS 정책: 본인 주문의 반품 기록만 조회/삽입 가능
CREATE POLICY "users_read_own_returns"
ON public.order_returns FOR SELECT
USING (
  auth.uid() = (
    SELECT user_id FROM public.orders WHERE order_id = order_returns.order_id
  )
);

CREATE POLICY "users_insert_own_returns"
ON public.order_returns FOR INSERT
WITH CHECK (
  auth.uid() = (
    SELECT user_id FROM public.orders WHERE order_id = order_returns.order_id
  )
);

-- 6. 재고 복원 RPC 함수 (취소/반품 시 호출)
CREATE OR REPLACE FUNCTION increase_stock(
  p_product_id UUID,
  p_size TEXT,
  p_quantity INT
)
RETURNS VOID AS $$
BEGIN
  UPDATE inventory
  SET stock = stock + p_quantity
  WHERE product_id = p_product_id AND size = p_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION increase_stock IS '주문 취소/반품 시 재고를 복원합니다';
