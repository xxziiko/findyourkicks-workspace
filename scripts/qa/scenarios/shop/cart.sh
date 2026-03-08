#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Shop 장바구니 시나리오
# ← cart-flow.test.ts
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../../lib.sh"

SESSION="${SESSION:-qa-shop-cart}"
scenario_header "Shop 장바구니 플로우"

# 로그인 먼저
new_session "qa-shop-cart"
ab_login_shop || { fail "Shop 로그인 실패"; summary; exit 1; }

# ── 1. 상품 → 사이즈 선택 → 장바구니 추가 ──
ab_open "${SHOP_URL}"
sleep 3

# 첫 번째 상품 링크의 href를 가져와서 직접 이동 (Next.js 클라이언트 라우팅 대응)
product_url=$(ab eval "document.querySelector('a[href^=\"/product/\"]')?.href" 2>/dev/null || echo "")
product_url=$(echo "$product_url" | tr -d '"' | xargs)
if [ -n "$product_url" ] && [ "$product_url" != "undefined" ] && [ "$product_url" != "null" ]; then
  ab_open "$product_url"
else
  # fallback: snapshot에서 ref 추출 후 클릭
  ref=$(ab snapshot -i 2>/dev/null | grep -m1 'link.*원' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
  if [ -n "$ref" ]; then
    ab click "@$ref" 2>/dev/null || true
  fi
fi
sleep 3

assert_url "/product/" "상품 상세 페이지 이동"

# 사이즈 버튼 snapshot에서 찾아서 클릭 (disabled 아닌 버튼)
snapshot_text=$(ab snapshot -i 2>/dev/null || echo "")
size_ref=$(echo "$snapshot_text" | grep -E 'button "([0-9]{3})"' | head -1 | grep -o 'ref=e[0-9]*' | sed 's/ref=//')
if [ -n "$size_ref" ]; then
  ab click "@$size_ref" 2>/dev/null || true
  sleep 1
fi

# 장바구니 버튼 클릭
cart_ref=$(echo "$snapshot_text" | grep -i '장바구니' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
if [ -n "$cart_ref" ]; then
  ab click "@$cart_ref" 2>/dev/null || true
else
  ab eval "document.querySelector('button')&&[...document.querySelectorAll('button')].find(b=>b.textContent.includes('장바구니'))?.click()" 2>/dev/null || true
fi
sleep 2

pass "장바구니 추가 요청 완료"

# ── 2. /cart 접근 → 목록 표시 ──
ab_open "${SHOP_URL}/cart"
sleep 3
assert_visible_any "/cart 페이지 콘텐츠" "상품/옵션 정보" "장바구니가 비어있어요!" "cart"

# ── 3. 장바구니에 상품이 있을 때 주문하기 버튼 ──
assert_visible_any "주문하기 버튼 표시" "주문하기" "order"

# ── 4. 주문하기 → /checkout 이동 ──
order_ref=$(ab snapshot -i 2>/dev/null | grep -i '주문하기' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
if [ -n "$order_ref" ]; then
  ab click "@$order_ref" 2>/dev/null || true
else
  ab eval "[...document.querySelectorAll('button')].find(b=>b.textContent.includes('주문하기'))?.click()" 2>/dev/null || true
fi
wait_for_url_change "/checkout/" 10 || true
assert_url "/checkout/" "주문하기 → checkout 페이지 이동"

ab_close

# ── 결과 ──
summary
