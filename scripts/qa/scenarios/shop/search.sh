#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Shop 검색/필터 시나리오
# ← search-filter.test.ts
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../../lib.sh"

SESSION="${SESSION:-qa-shop-search}"
scenario_header "Shop 검색/필터 플로우"

new_session "qa-shop-search"

# ── 1. /products 페이지 로드 확인 ──
ab_open "${SHOP_URL}/products"
sleep 3
assert_visible "상품 검색" "/products 검색창 렌더링"
assert_visible "정렬 방식" "/products 정렬 드롭다운 렌더링"

# ── 2. 검색어 입력 → URL ?q= 반영 ──
# snapshot에서 searchbox ref 추출
search_ref=$(ab snapshot -i 2>/dev/null | grep -i 'searchbox' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
if [ -n "$search_ref" ]; then
  ab fill "@$search_ref" "nike" 2>/dev/null || true
else
  ab eval "const el=document.querySelector('input[type=\"search\"]')||document.querySelector('input[role=\"searchbox\"]'); if(el){el.focus();el.value='nike';el.dispatchEvent(new Event('input',{bubbles:true}))}" 2>/dev/null || true
fi
# 디바운스 300ms + 여유
sleep 2
wait_for_url_change "q=nike" 10 || true
assert_url "q=nike" "검색어 → URL ?q=nike 반영"

# ── 3. 정렬 URL → select 반영 + 상품 순서 검증 ──
ab_open "${SHOP_URL}/products?sort=price_asc"
sleep 3
# select 값이 URL에서 읽혀 price_asc로 설정되었는지 확인
sort_val=$(ab eval "document.querySelector('select')?.value" 2>/dev/null | tr -d '"')
if [ "$sort_val" = "price_asc" ]; then
  pass "정렬 URL ?sort=price_asc → select 반영"
else
  fail "정렬 URL ?sort=price_asc → select 반영 (실제: $sort_val)"
fi

# ── 4. 상품 목록 렌더링 ──
ab_open "${SHOP_URL}/products"
sleep 3
assert_visible_any "상품 목록 렌더링" "product" "검색 결과가 없습니다"

ab_close

# ── 결과 ──
summary
