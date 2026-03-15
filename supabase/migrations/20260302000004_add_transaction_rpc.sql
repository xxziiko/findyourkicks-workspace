-- ============================================================
-- Transaction RPC functions for atomic multi-step operations
-- ============================================================

-- 1) cancel_order_after_toss
--    Toss 결제 취소 성공 후 DB를 원자적으로 처리:
--    주문 상태 cancelled + 취소 기록 INSERT + 재고 복원
CREATE OR REPLACE FUNCTION public.cancel_order_after_toss(
  p_order_id                   UUID,
  p_reason                     TEXT,
  p_cancel_request_id          UUID,
  p_toss_cancel_transaction_key TEXT,
  p_toss_canceled_at           TIMESTAMPTZ,
  p_toss_raw                   JSONB DEFAULT NULL
) RETURNS TABLE(order_id UUID, restored_item_count INT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_order  RECORD;
  v_item   RECORD;
  v_count  INT := 0;
BEGIN
  -- 1) orders FOR UPDATE 잠금 + 소유자 + 상태 검증
  SELECT * INTO v_order
  FROM orders
  WHERE orders.order_id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: order %', p_order_id;
  END IF;

  IF v_order.user_id <> auth.uid() THEN
    RAISE EXCEPTION 'FORBIDDEN: not owner';
  END IF;

  IF v_order.status NOT IN ('paid', 'preparing') THEN
    RAISE EXCEPTION 'INVALID_STATE: cannot cancel status=%', v_order.status;
  END IF;

  -- 2) idempotency: 동일 취소 요청이 이미 처리됐으면 재응답
  IF EXISTS (
    SELECT 1 FROM order_cancellations
    WHERE order_cancellations.order_id = p_order_id
  ) THEN
    RETURN QUERY SELECT p_order_id, 0;
    RETURN;
  END IF;

  -- 3) 주문 상태 업데이트
  UPDATE orders
  SET status = 'cancelled'
  WHERE orders.order_id = p_order_id;

  -- 4) 취소 기록 저장
  INSERT INTO order_cancellations(order_id, reason, status)
  VALUES (p_order_id, COALESCE(p_reason, '고객 취소'), 'completed');

  -- 5) 재고 복원 (set-based UPDATE)
  FOR v_item IN
    SELECT oi.product_id, oi.size, oi.quantity
    FROM order_items oi
    WHERE oi.order_id = p_order_id
  LOOP
    UPDATE inventory
    SET stock = stock + v_item.quantity
    WHERE inventory.product_id = v_item.product_id
      AND inventory.size       = v_item.size;
    v_count := v_count + 1;
  END LOOP;

  RETURN QUERY SELECT p_order_id, v_count;
END;
$$;


-- 2) approve_return_request
--    반품/교환 승인: order_returns.status + orders.status 원자적 업데이트
CREATE OR REPLACE FUNCTION public.approve_return_request(
  p_return_id UUID
) RETURNS TABLE(return_id UUID, order_id UUID, order_status TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_return     RECORD;
  v_new_status TEXT;
BEGIN
  -- 1) order_returns FOR UPDATE 잠금 + status='requested' 검증
  SELECT * INTO v_return
  FROM order_returns
  WHERE order_returns.return_id = p_return_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: return %', p_return_id;
  END IF;

  IF v_return.status <> 'requested' THEN
    RAISE EXCEPTION 'INVALID_STATE: already processed status=%', v_return.status;
  END IF;

  -- 2) 반품 상태 업데이트
  UPDATE order_returns
  SET status = 'approved'
  WHERE order_returns.return_id = p_return_id;

  -- 3) 주문 상태 업데이트
  v_new_status := CASE v_return.return_type
    WHEN 'exchange' THEN 'exchange_approved'
    ELSE 'return_approved'
  END;

  UPDATE orders
  SET status = v_new_status
  WHERE orders.order_id = v_return.order_id;

  RETURN QUERY SELECT p_return_id, v_return.order_id, v_new_status;
END;
$$;


-- 3) request_return_for_order
--    반품/교환 신청: order_returns INSERT + orders.status 원자적 업데이트
CREATE OR REPLACE FUNCTION public.request_return_for_order(
  p_order_id   UUID,
  p_return_type TEXT,
  p_reason     TEXT,
  p_details    TEXT DEFAULT NULL
) RETURNS TABLE(return_id UUID, order_status TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_order        RECORD;
  v_new_status   TEXT;
  v_new_return_id UUID;
  v_diff_days    NUMERIC;
BEGIN
  -- 1) orders FOR UPDATE 잠금 + 소유자 + 상태(delivered) 검증
  SELECT * INTO v_order
  FROM orders
  WHERE orders.order_id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: order %', p_order_id;
  END IF;

  IF v_order.user_id <> auth.uid() THEN
    RAISE EXCEPTION 'FORBIDDEN: not owner';
  END IF;

  IF v_order.status <> 'delivered' THEN
    RAISE EXCEPTION 'INVALID_STATE: not delivered status=%', v_order.status;
  END IF;

  -- 2) 반품 기간 검증 (7일)
  v_diff_days := EXTRACT(EPOCH FROM (NOW() - v_order.order_date)) / 86400.0;
  IF v_diff_days > 7 THEN
    RAISE EXCEPTION 'INVALID_STATE: return period expired';
  END IF;

  -- 3) order_returns INSERT
  INSERT INTO order_returns(order_id, return_type, reason, details, status)
  VALUES (p_order_id, p_return_type, p_reason, p_details, 'requested')
  RETURNING order_returns.return_id INTO v_new_return_id;

  -- 4) 주문 상태 업데이트
  v_new_status := CASE p_return_type
    WHEN 'exchange' THEN 'exchange_requested'
    ELSE 'return_requested'
  END;

  UPDATE orders
  SET status = v_new_status
  WHERE orders.order_id = p_order_id;

  RETURN QUERY SELECT v_new_return_id, v_new_status;
END;
$$;
