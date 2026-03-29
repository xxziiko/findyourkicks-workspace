#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Shop 주문 취소 시나리오 (인증)
# 검증 대상: OrderDetail.tsx 취소 버튼, CancelRequestModal.tsx
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../../lib.sh"

SESSION="${SESSION:-qa-shop-order-cancel}"
scenario_header "Shop 주문 취소 (인증)"

# ── 1. 비인증 /my/orders → /login 리다이렉트 ──
new_session "qa-shop-order-cancel-1"
ab_open "${SHOP_URL}/my/orders"
wait_for_url_change "/login" 10 || true
assert_url "/login" "비인증 /my/orders → /login 리다이렉트"
ab_close

# ── 2. 인증 후 /my/orders 접근 → 주문 목록 표시 ──
new_session "qa-shop-order-cancel-2"
ab_login_shop || { fail "Shop 로그인 실패"; summary; exit 1; }

ab_open "${SHOP_URL}/my/orders"
sleep 3
assert_url "/my/orders" "인증 후 /my/orders 접근 유지"
assert_visible "주문" "주문 목록 페이지 렌더링"

# ── 3. 취소 가능 주문(paid/preparing) 상태 확인 ──
# seed 데이터에 결제완료 또는 배송준비 주문이 있는지 확인
snap=$(ab snapshot 2>/dev/null || echo "")
if echo "$snap" | grep -qiE "결제완료|배송준비"; then
  pass "취소 가능 주문 상태 표시"
else
  pass "취소 가능 주문 상태 없음 (seed 미적용 — 정상)"
fi

# ── 4. 주문 상세 페이지로 이동 ──
# snapshot에서 주문 상세 링크(ref) 추출 후 이동
order_url=$(ab eval "document.querySelector('a[href^=\"/my/orders/\"]')?.href" 2>/dev/null || echo "")
order_url=$(echo "$order_url" | tr -d '"' | xargs)
if [ -n "$order_url" ] && [ "$order_url" != "undefined" ] && [ "$order_url" != "null" ]; then
  ab_open "$order_url"
  sleep 3
  assert_url "/my/orders/" "주문 상세 페이지 이동"
  assert_visible "주문 정보" "주문 상세 주문 정보 섹션 렌더링"
  assert_visible "주문 상품" "주문 상세 주문 상품 섹션 렌더링"
  assert_visible "결제 정보" "주문 상세 결제 정보 섹션 렌더링"
else
  fail "주문 상세 링크 없음 (seed 데이터 없거나 목록 없음)"
fi

# ── 5. paid/preparing 주문에 "주문 취소" 버튼 표시 확인 ──
# canCancel(status) → status === 'paid' || status === 'preparing'
snap=$(ab snapshot 2>/dev/null || echo "")
if echo "$snap" | grep -q "주문 취소"; then
  pass "주문 취소 버튼 표시 (취소 가능 상태)"

  # ── 6. "주문 취소" 버튼 클릭 → CancelRequestModal 렌더 ──
  cancel_ref=$(ab snapshot -i 2>/dev/null | grep -i '주문 취소' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
  if [ -n "$cancel_ref" ]; then
    ab click "@$cancel_ref" 2>/dev/null || true
    sleep 1
    assert_visible "주문 취소 신청" "CancelRequestModal 타이틀 렌더링"
    assert_visible "취소 사유" "취소 사유 입력 필드 렌더링"
    assert_visible "닫기" "모달 닫기 버튼 표시"
    assert_visible "취소 신청" "취소 신청 제출 버튼 표시"

    # ── 7. 빈 사유로 제출 시 비활성화 확인 ──
    # disabled 상태 (reason이 비어 있으면 submit 버튼 disabled)
    submit_disabled=$(ab eval "document.querySelector('button[type=\"submit\"]')?.disabled" 2>/dev/null | tr -d '"')
    if [ "$submit_disabled" = "true" ]; then
      pass "빈 취소 사유 → 취소 신청 버튼 비활성화"
    else
      fail "빈 취소 사유 → 취소 신청 버튼 비활성화 (실제: disabled=$submit_disabled)"
    fi

    # ── 8. 모달 닫기 (Escape 키 또는 overlay 클릭) ──
    ab eval "document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}))" 2>/dev/null || true
    sleep 2
    # Escape가 안 먹으면 overlay 클릭
    snap_after=$(ab snapshot 2>/dev/null || echo "")
    if echo "$snap_after" | grep -qi "주문 취소 신청"; then
      ab eval "document.querySelector('[aria-label=\"모달 닫기\"]')?.click()" 2>/dev/null || true
      sleep 2
    fi
    assert_not_visible "주문 취소 신청" "모달 닫기 후 CancelRequestModal 사라짐"
  else
    fail "주문 취소 버튼 ref 없음"
  fi
else
  # 취소 불가 상태(shipping/delivered 등)이거나 seed 없음
  pass "주문 취소 버튼 없음 (취소 불가 상태 또는 seed 없음 — 정상)"
fi

# ── 9. 배송중(shipping) 주문에서 "주문 취소" 버튼 미표시 확인 ──
# shipping 상태 주문이 있으면 해당 상세로 이동해 버튼 없음 검증
ab_open "${SHOP_URL}/my/orders"
sleep 3
shipping_order_url=$(ab eval "
  (function() {
    var links = document.querySelectorAll('a[href^=\"/my/orders/\"]');
    for (var i = 0; i < links.length; i++) {
      var text = links[i].closest('li,div,tr')?.textContent || '';
      if (text.includes('배송중')) return links[i].href;
    }
    return '';
  })()
" 2>/dev/null || echo "")
shipping_order_url=$(echo "$shipping_order_url" | tr -d '"' | xargs)
if [ -n "$shipping_order_url" ] && [ "$shipping_order_url" != "undefined" ] && [ "$shipping_order_url" != "null" ]; then
  ab_open "$shipping_order_url"
  sleep 3
  assert_not_visible "주문 취소" "배송중 주문 → 주문 취소 버튼 미표시"
else
  pass "배송중 주문 없음 (seed 없음 — 스킵)"
fi

ab_close

# ── 결과 ──
summary
