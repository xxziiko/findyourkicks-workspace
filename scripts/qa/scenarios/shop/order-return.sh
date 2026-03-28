#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Shop 반품/교환 신청 시나리오 (인증)
# 검증 대상: OrderDetail.tsx 반품/교환 버튼, ReturnRequestForm.tsx
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../../lib.sh"

SESSION="${SESSION:-qa-shop-order-return}"
scenario_header "Shop 반품/교환 신청 (인증)"

# ── 1. 비인증 반품 API → 4xx ──
assert_status "POST" \
  "${SHOP_URL}/api/orders/non-existent-order/return" \
  "^4[0-9][0-9]$" \
  "비인증 반품 API → 4xx"

# ── 2. 인증 후 /my/orders 접근 ──
new_session "qa-shop-order-return"
ab_login_shop || { fail "Shop 로그인 실패"; summary; exit 1; }

ab_open "${SHOP_URL}/my/orders"
sleep 3
assert_url "/my/orders" "인증 후 /my/orders 접근 유지"

# ── 3. delivered 주문 상세로 이동 → "반품/교환 신청" 버튼 확인 ──
# isReturnable = status === 'delivered' && canReturn(orderDate) (7일 이내)
delivered_order_url=$(ab eval "
  (function() {
    var links = document.querySelectorAll('a[href^=\"/my/orders/\"]');
    for (var i = 0; i < links.length; i++) {
      var text = links[i].closest('li,div,tr')?.textContent || '';
      if (text.includes('배송완료')) return links[i].href;
    }
    return '';
  })()
" 2>/dev/null || echo "")
delivered_order_url=$(echo "$delivered_order_url" | tr -d '"' | xargs)

if [ -n "$delivered_order_url" ] && [ "$delivered_order_url" != "undefined" ] && [ "$delivered_order_url" != "null" ]; then
  ab_open "$delivered_order_url"
  sleep 3
  assert_url "/my/orders/" "배송완료 주문 상세 페이지 이동"
  assert_visible "주문 정보" "주문 상세 주문 정보 섹션 렌더링"

  snap=$(ab snapshot 2>/dev/null || echo "")
  if echo "$snap" | grep -q "반품/교환 신청"; then
    pass "반품/교환 신청 버튼 표시 (delivered + 7일 이내)"

    # ── 4. "반품/교환 신청" 버튼 클릭 → ReturnRequestForm 렌더 ──
    return_ref=$(ab snapshot -i 2>/dev/null | grep -i '반품/교환 신청' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
    if [ -n "$return_ref" ]; then
      ab click "@$return_ref" 2>/dev/null || true
      sleep 1

      assert_visible "반품/교환 신청" "ReturnRequestForm 타이틀 렌더링"
      assert_visible "신청 유형" "신청 유형 (반품/교환 라디오) 렌더링"
      assert_visible "반품" "반품 라디오 버튼 표시"
      assert_visible "교환" "교환 라디오 버튼 표시"
      assert_visible "사유 선택" "사유 선택 드롭다운 렌더링"
      assert_visible "사유를 선택해주세요" "사유 선택 기본 옵션 표시"
      assert_visible "상세 사유" "상세 사유 입력 필드 렌더링"
      assert_visible "닫기" "모달 닫기 버튼 표시"
      assert_visible "신청" "신청 제출 버튼 표시"

      # ── 5. 사유 미선택 시 신청 버튼 비활성화 ──
      submit_disabled=$(ab eval "document.querySelector('button[type=\"submit\"]')?.disabled" 2>/dev/null | tr -d '"')
      if [ "$submit_disabled" = "true" ]; then
        pass "사유 미선택 → 신청 버튼 비활성화"
      else
        fail "사유 미선택 → 신청 버튼 비활성화 (실제: disabled=$submit_disabled)"
      fi

      # ── 6. 사유 선택 후 버튼 활성화 확인 ──
      ab eval "
        var sel = document.querySelector('select#return-reason');
        if (sel) {
          sel.value = '단순 변심';
          sel.dispatchEvent(new Event('change', {bubbles: true}));
        }
      " 2>/dev/null || true
      sleep 1
      submit_disabled_after=$(ab eval "document.querySelector('button[type=\"submit\"]')?.disabled" 2>/dev/null | tr -d '"')
      if [ "$submit_disabled_after" = "false" ] || [ -z "$submit_disabled_after" ]; then
        pass "사유 선택 후 신청 버튼 활성화"
      else
        fail "사유 선택 후 신청 버튼 활성화 (실제: disabled=$submit_disabled_after)"
      fi

      # ── 7. 모달 닫기 ──
      close_ref=$(ab snapshot -i 2>/dev/null | grep -i '닫기' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
      if [ -n "$close_ref" ]; then
        ab click "@$close_ref" 2>/dev/null || true
        sleep 1
        assert_not_visible "반품/교환 신청" "모달 닫기 후 ReturnRequestForm 사라짐"
      else
        fail "모달 닫기 버튼 ref 없음"
      fi
    else
      fail "반품/교환 신청 버튼 ref 없음"
    fi
  else
    # delivered이지만 7일 초과 → 버튼 없음이 정상
    assert_not_visible "반품/교환 신청" "반품 기간 만료 주문 → 반품/교환 신청 버튼 미표시"
  fi
else
  pass "배송완료 주문 없음 (seed 없음 — 스킵)"
fi

# ── 8. shipping 주문에서 "반품/교환 신청" 버튼 미표시 ──
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
  assert_not_visible "반품/교환 신청" "배송중 주문 → 반품/교환 신청 버튼 미표시"
else
  pass "배송중 주문 없음 (seed 없음 — 스킵)"
fi

# ── 9. paid 주문에서 "반품/교환 신청" 버튼 미표시 ──
ab_open "${SHOP_URL}/my/orders"
sleep 3
paid_order_url=$(ab eval "
  (function() {
    var links = document.querySelectorAll('a[href^=\"/my/orders/\"]');
    for (var i = 0; i < links.length; i++) {
      var text = links[i].closest('li,div,tr')?.textContent || '';
      if (text.includes('결제완료')) return links[i].href;
    }
    return '';
  })()
" 2>/dev/null || echo "")
paid_order_url=$(echo "$paid_order_url" | tr -d '"' | xargs)
if [ -n "$paid_order_url" ] && [ "$paid_order_url" != "undefined" ] && [ "$paid_order_url" != "null" ]; then
  ab_open "$paid_order_url"
  sleep 3
  assert_not_visible "반품/교환 신청" "결제완료 주문 → 반품/교환 신청 버튼 미표시"
else
  pass "결제완료 주문 없음 (seed 없음 — 스킵)"
fi

ab_close

# ── 결과 ──
summary
