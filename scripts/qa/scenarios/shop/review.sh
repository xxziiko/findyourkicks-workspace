#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Shop 리뷰 시나리오
# ← review.test.ts
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../../lib.sh"

SESSION="${SESSION:-qa-shop-review}"
scenario_header "Shop 리뷰 섹션"

# 비인증 세션 사용
new_session "qa-shop-review"

# ── 1. 상품 상세 → 리뷰 섹션 렌더링 ──
ab_open "${SHOP_URL}"
sleep 3

# 첫 번째 상품 링크의 href를 가져와서 직접 이동
product_url=$(ab eval "document.querySelector('a[href^=\"/product/\"]')?.href" 2>/dev/null || echo "")
product_url=$(echo "$product_url" | tr -d '"' | xargs)
if [ -n "$product_url" ] && [ "$product_url" != "undefined" ] && [ "$product_url" != "null" ]; then
  ab_open "$product_url"
else
  ref=$(ab snapshot -i 2>/dev/null | grep -m1 'link.*원' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
  if [ -n "$ref" ]; then
    ab click "@$ref" 2>/dev/null || true
  fi
fi
sleep 5

assert_url "/product/" "상품 상세 페이지 이동"

# 스크롤해서 리뷰 섹션이 로드되도록
ab scroll down 500 2>/dev/null || true
sleep 3

assert_visible_any "리뷰 섹션 렌더링" "리뷰" "review" "Review"

# 리뷰 내용 확인 (리뷰 있음 OR 없음 메시지)
assert_visible_any "리뷰 상태 표시" "리뷰가 없습니다" "리뷰를 불러오는 중" "ReviewCard" "reviewCard" "리뷰"

# ── 2. 비인증 eligibility API → canReview: false ──
assert_json_field \
  "${SHOP_URL}/api/products/some-product-id/reviews/eligibility" \
  "canReview" \
  "false" \
  "비인증 eligibility API → canReview: false"

# ── 3. 비인증 → 리뷰 작성 버튼 미표시 ──
assert_not_visible "리뷰 작성" "비인증 시 리뷰 작성 버튼 없음"

ab_close

# ── 결과 ──
summary
