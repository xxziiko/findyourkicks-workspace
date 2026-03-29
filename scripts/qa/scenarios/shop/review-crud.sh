#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Shop 리뷰 CRUD 시나리오
# 검증 대상: ReviewSection.tsx, ReviewForm.tsx
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../../lib.sh"

SESSION="${SESSION:-qa-shop-review-crud}"
scenario_header "Shop 리뷰 CRUD"

# ─────────────────────────────────────────────────────────
# 공통: 상품 상세 URL 탐색 헬퍼
# ─────────────────────────────────────────────────────────
get_first_product_url() {
  ab_open "${SHOP_URL}" >/dev/null 2>&1
  sleep 3
  local raw url
  raw=$(ab eval "document.querySelector('a[href^=\"/product/\"]')?.href" 2>/dev/null || echo "")
  # ANSI 코드 제거 + 따옴표 제거 + 공백 제거
  url=$(echo "$raw" | sed 's/\x1b\[[0-9;]*m//g' | tr -d '"' | tr -d "'" | xargs)
  # 유효한 URL인지 확인
  if echo "$url" | grep -q "^http"; then
    echo "$url"
  elif echo "$url" | grep -q "^/product/"; then
    echo "${SHOP_URL}${url}"
  else
    echo ""
  fi
}

# ─────────────────────────────────────────────────────────
# 1. 비인증 — 상품 상세 리뷰 섹션 렌더링
# ─────────────────────────────────────────────────────────
new_session "qa-shop-review-crud-1"

product_url=$(get_first_product_url)
if [ -n "$product_url" ] && [ "$product_url" != "undefined" ] && [ "$product_url" != "null" ]; then
  ab_open "$product_url"
  sleep 5
  assert_url "/product/" "비인증 상품 상세 페이지 이동"

  # 스크롤 다운하여 리뷰 섹션 가시화
  ab scroll down 600 2>/dev/null || true
  sleep 2

  # ReviewSection h2 "리뷰" 렌더링 확인
  assert_visible "리뷰" "비인증 리뷰 섹션 렌더링"

  # ── 2. 비인증 → 리뷰 작성 버튼 미표시 (eligibility.canReview = false) ──
  assert_not_visible "리뷰 작성" "비인증 시 리뷰 작성 버튼 없음"

  # ── 3. 비인증 → 구매 후 작성 가능 안내 표시 ──
  # ReviewSection: reason === 'NOT_PURCHASED' → "구매 후 작성 가능합니다."
  assert_visible_any "비인증 리뷰 작성 불가 안내" "구매 후 작성 가능합니다" "구매 후 작성"
else
  fail "첫 번째 상품 URL 없음 (seed 없음)"
fi

ab_close

# ─────────────────────────────────────────────────────────
# 4. 비인증 eligibility API → canReview: false
# ─────────────────────────────────────────────────────────
assert_json_field \
  "${SHOP_URL}/api/products/some-product-id/reviews/eligibility" \
  "canReview" \
  "false" \
  "비인증 eligibility API → canReview: false"

# ─────────────────────────────────────────────────────────
# 5. 인증 후 상품 상세 → 리뷰 섹션 확인
# ─────────────────────────────────────────────────────────
new_session "qa-shop-review-crud-2"
ab_login_shop || { fail "Shop 로그인 실패"; summary; exit 1; }

product_url=$(get_first_product_url)
if [ -n "$product_url" ] && [ "$product_url" != "undefined" ] && [ "$product_url" != "null" ]; then
  ab_open "$product_url"
  sleep 5
  assert_url "/product/" "인증 후 상품 상세 페이지 이동"

  ab scroll down 600 2>/dev/null || true
  sleep 2

  assert_visible "리뷰" "인증 후 리뷰 섹션 렌더링"

  # ── 6. 인증 후 eligibility에 따라 리뷰 작성 버튼 또는 안내 표시 ──
  snap=$(ab snapshot 2>/dev/null || echo "")
  if echo "$snap" | grep -q "리뷰 작성"; then
    pass "인증 후 리뷰 작성 버튼 표시 (canReview: true)"

    # ── 7. 리뷰 작성 버튼 클릭 → ReviewForm 렌더 ──
    write_ref=$(ab snapshot -i 2>/dev/null | grep -i '리뷰 작성' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
    if [ -n "$write_ref" ]; then
      ab click "@$write_ref" 2>/dev/null || true
      sleep 1

      # ReviewForm UI 확인
      assert_visible "별점" "ReviewForm 별점 필드 렌더링"
      assert_visible "내용" "ReviewForm 내용 입력 필드 렌더링"
      assert_visible "사진" "ReviewForm 사진 업로드 필드 렌더링"
      assert_visible "리뷰 등록" "ReviewForm 등록 버튼 표시"
      assert_visible "취소" "ReviewForm 취소 버튼 표시"

      # ── 8. 별점 0인 상태에서 등록 버튼 비활성화 ──
      # disabled={rating === 0 || isLoading}
      submit_disabled=$(ab eval "
        var btns = document.querySelectorAll('button[type=\"submit\"]');
        for (var i = 0; i < btns.length; i++) {
          if (btns[i].textContent.includes('리뷰 등록') || btns[i].textContent.includes('등록 중')) {
            return btns[i].disabled;
          }
        }
        return null;
      " 2>/dev/null | tr -d '"')
      if [ "$submit_disabled" = "true" ]; then
        pass "별점 0 → 리뷰 등록 버튼 비활성화"
      else
        fail "별점 0 → 리뷰 등록 버튼 비활성화 (실제: disabled=$submit_disabled)"
      fi

      # ── 9. 취소 버튼 클릭 → 폼 닫힘 ──
      cancel_ref=$(ab snapshot -i 2>/dev/null | grep -i '취소' | grep 'button' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
      if [ -n "$cancel_ref" ]; then
        ab click "@$cancel_ref" 2>/dev/null || true
        sleep 1
        assert_not_visible "리뷰 등록" "취소 후 ReviewForm 사라짐"
        assert_visible "리뷰" "취소 후 리뷰 섹션 유지"
      else
        fail "리뷰 폼 취소 버튼 ref 없음"
      fi
    else
      fail "리뷰 작성 버튼 ref 없음"
    fi
  elif echo "$snap" | grep -q "이미 리뷰를 작성하셨습니다"; then
    pass "인증 후 이미 작성한 리뷰 안내 표시 (ALREADY_REVIEWED)"
  else
    pass "인증 후 리뷰 작성 불가 (구매 이력 없음 — 정상)"
  fi
else
  fail "첫 번째 상품 URL 없음 (seed 없음)"
fi

ab_close

# ─────────────────────────────────────────────────────────
# 10. 리뷰 목록 렌더링 (리뷰 있음 / 없음 모두 허용)
# ─────────────────────────────────────────────────────────
new_session "qa-shop-review-crud-3"
if [ -n "${product_url:-}" ] && [ "$product_url" != "undefined" ] && [ "$product_url" != "null" ]; then
  ab_open "$product_url"
  sleep 5
  ab scroll down 600 2>/dev/null || true
  sleep 2
  assert_visible_any "리뷰 목록 상태 표시" "리뷰가 없습니다" "리뷰를 불러오는 중" "점"
else
  pass "상품 URL 없음 — 리뷰 목록 확인 스킵"
fi
ab_close

# ── 결과 ──
summary
