#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Shop 주문 취소/반품 시나리오
# ← order-cancel.test.ts
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../../lib.sh"

SESSION="${SESSION:-qa-shop-order}"
scenario_header "Shop 주문 취소/반품"

# ── 1. 비인증 /my/orders → /login 리다이렉트 ──
new_session "qa-shop-order-1"
ab_open "${SHOP_URL}/my/orders"
wait_for_url_change "/login" 10 || true
assert_url "/login" "비인증 /my/orders → /login 리다이렉트"
ab_close

# ── 2. 비인증 /my/orders/[id] → /login 리다이렉트 ──
new_session "qa-shop-order-2"
ab_open "${SHOP_URL}/my/orders/test-order-id"
wait_for_url_change "/login" 20 || true
assert_url "/login" "비인증 /my/orders/[id] → /login 리다이렉트"
ab_close

# ── 3. 비인증 주문 취소 API → 4xx ──
assert_status "POST" \
  "${SHOP_URL}/api/orders/non-existent-order/cancel" \
  "^4[0-9][0-9]$" \
  "비인증 주문 취소 API → 4xx"

# ── 4. 비인증 반품 API → 4xx ──
assert_status "POST" \
  "${SHOP_URL}/api/orders/non-existent-order/return" \
  "^4[0-9][0-9]$" \
  "비인증 반품 API → 4xx"

# ── 결과 ──
summary
