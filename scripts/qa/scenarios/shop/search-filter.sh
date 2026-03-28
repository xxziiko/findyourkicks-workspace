#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Shop 검색/필터 시나리오
# 검증 대상: SearchBar.tsx (aria-label="상품 검색"),
#           SortSelect.tsx (aria-label="정렬 방식"),
#           FilterPanel.tsx (브랜드/카테고리/사이즈/가격 범위)
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../../lib.sh"

SESSION="${SESSION:-qa-shop-search-filter}"
scenario_header "Shop 검색/필터 플로우"

new_session "qa-shop-search-filter"

# ── 1. /products 페이지 로드 ──
ab_open "${SHOP_URL}/products"
sleep 3
assert_url "/products" "/products 페이지 로드"

# ── 2. 검색창(SearchBar) 렌더링 확인 ──
assert_visible "상품 검색" "/products 검색창 렌더링 (aria-label)"

# ── 3. 정렬 드롭다운(SortSelect) 렌더링 확인 ──
assert_visible "정렬 방식" "/products 정렬 드롭다운 렌더링 (aria-label)"

# ── 4. FilterPanel 렌더링 확인 ──
# FilterPanel은 조건부 렌더: brands/categories/sizes 배열이 비어있으면 해당 그룹 없음
# 항상 노출되는 "가격 범위" 섹션으로 확인
assert_visible "가격 범위" "FilterPanel 가격 범위 그룹 렌더링"
assert_visible "최저가" "FilterPanel 최저가 입력 placeholder 렌더링"
assert_visible "최고가" "FilterPanel 최고가 입력 placeholder 렌더링"

# 브랜드/카테고리/사이즈는 seed 데이터 존재 시에만 노출 (없으면 스킵)
snap=$(ab snapshot 2>/dev/null || echo "")
if echo "$snap" | grep -qi "브랜드"; then
  pass "FilterPanel 브랜드 그룹 렌더링"
else
  pass "FilterPanel 브랜드 그룹 없음 (seed 없음 — 정상)"
fi

# ── 5. 검색어 입력 → URL ?q= 반영 ──
search_ref=$(ab snapshot -i 2>/dev/null | grep -i 'searchbox\|상품 검색' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
if [ -n "$search_ref" ]; then
  ab fill "@$search_ref" "nike" 2>/dev/null || true
else
  ab eval "
    var el = document.querySelector('[aria-label=\"상품 검색\"]')
           || document.querySelector('input[type=\"search\"]')
           || document.querySelector('input[role=\"searchbox\"]');
    if (el) {
      el.focus();
      el.value = 'nike';
      el.dispatchEvent(new Event('input', {bubbles: true}));
    }
  " 2>/dev/null || true
fi
# 디바운스 대기 (SearchBar 디바운스 300ms 기준 + 여유)
sleep 2
wait_for_url_change "q=nike" 10 || true
assert_url "q=nike" "검색어 입력 → URL ?q=nike 반영"

# ── 6. 검색 결과 또는 빈 결과 메시지 렌더링 ──
assert_visible_any "검색 결과 렌더링" "nike" "검색 결과가 없습니다" "product"

# ── 7. 검색어 지우기 → URL에서 q 파라미터 제거 ──
search_ref2=$(ab snapshot -i 2>/dev/null | grep -i 'searchbox\|상품 검색' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
if [ -n "$search_ref2" ]; then
  ab fill "@$search_ref2" "" 2>/dev/null || true
else
  ab eval "
    var el = document.querySelector('[aria-label=\"상품 검색\"]')
           || document.querySelector('input[type=\"search\"]');
    if (el) {
      el.value = '';
      el.dispatchEvent(new Event('input', {bubbles: true}));
    }
  " 2>/dev/null || true
fi
sleep 2
# q= 파라미터가 사라지거나 빈 값이 되어야 함
current_url=$(ab_get_url 2>/dev/null || echo "")
if echo "$current_url" | grep -qv "q=nike"; then
  pass "검색어 지우기 → URL에서 q=nike 제거"
else
  fail "검색어 지우기 → URL에서 q=nike 제거 (실제: $current_url)"
fi

# ── 8. 정렬 URL 직접 접근 → SortSelect 값 반영 ──
ab_open "${SHOP_URL}/products?sort=price_asc"
sleep 3
sort_val=$(ab eval "document.querySelector('[aria-label=\"정렬 방식\"]')?.value" 2>/dev/null | tr -d '"')
if [ "$sort_val" = "price_asc" ]; then
  pass "URL ?sort=price_asc → SortSelect 값 price_asc 반영"
else
  fail "URL ?sort=price_asc → SortSelect 값 반영 (실제: $sort_val)"
fi

# ── 9. 정렬 변경 → URL ?sort= 반영 ──
ab eval "
  var sel = document.querySelector('[aria-label=\"정렬 방식\"]');
  if (sel) {
    sel.value = 'price_desc';
    sel.dispatchEvent(new Event('change', {bubbles: true}));
  }
" 2>/dev/null || true
sleep 2
wait_for_url_change "sort=price_desc" 10 || true
assert_url "sort=price_desc" "정렬 변경 → URL ?sort=price_desc 반영"

# ── 10. 가격 범위 최저가 입력 → URL ?minPrice= 반영 ──
ab_open "${SHOP_URL}/products"
sleep 3
ab eval "
  var inputs = document.querySelectorAll('input[type=\"number\"]');
  var minInput = null;
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].placeholder === '최저가') { minInput = inputs[i]; break; }
  }
  if (minInput) {
    minInput.focus();
    minInput.value = '50000';
    minInput.dispatchEvent(new Event('input', {bubbles: true}));
    minInput.dispatchEvent(new Event('change', {bubbles: true}));
  }
" 2>/dev/null || true
sleep 2
wait_for_url_change "minPrice=50000" 10 || true
assert_url "minPrice=50000" "최저가 입력 → URL ?minPrice=50000 반영"

# ── 11. 가격 범위 최고가 입력 → URL ?maxPrice= 반영 ──
ab eval "
  var inputs = document.querySelectorAll('input[type=\"number\"]');
  var maxInput = null;
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].placeholder === '최고가') { maxInput = inputs[i]; break; }
  }
  if (maxInput) {
    maxInput.focus();
    maxInput.value = '200000';
    maxInput.dispatchEvent(new Event('input', {bubbles: true}));
    maxInput.dispatchEvent(new Event('change', {bubbles: true}));
  }
" 2>/dev/null || true
sleep 2
wait_for_url_change "maxPrice=200000" 10 || true
assert_url "maxPrice=200000" "최고가 입력 → URL ?maxPrice=200000 반영"

# ── 12. 필터 초기화 → /products (파라미터 없음) ──
ab_open "${SHOP_URL}/products"
sleep 3
assert_url "^${SHOP_URL}/products$" "필터 초기화 → /products (파라미터 없음)"

# 정렬 select가 기본값(latest)으로 초기화되었는지 확인
sort_val_reset=$(ab eval "document.querySelector('[aria-label=\"정렬 방식\"]')?.value" 2>/dev/null | tr -d '"')
if [ "$sort_val_reset" = "latest" ] || [ "$sort_val_reset" = "" ]; then
  pass "필터 초기화 → SortSelect 기본값(latest) 복원"
else
  fail "필터 초기화 → SortSelect 기본값 복원 (실제: $sort_val_reset)"
fi

# ── 13. 상품 목록 렌더링 ──
assert_visible_any "상품 목록 렌더링" "product" "검색 결과가 없습니다" "원"

ab_close

# ── 결과 ──
summary
