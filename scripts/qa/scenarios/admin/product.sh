#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Admin 상품 등록 시나리오
# ← productRegister.test.ts
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../../lib.sh"

SESSION="${SESSION:-qa-admin-product}"
FIXTURE_DIR="$(cd "${SCRIPT_DIR}/../../../.." && pwd)/apps/admin/src/tests/fixtures"

scenario_header "Admin 상품 등록"

# 먼저 로그인
new_session "qa-admin-product"
ab_login_admin || { fail "Admin 로그인 실패"; summary; exit 1; }

# 상품 등록 페이지로 이동
ab_open "${ADMIN_URL}/products/new"
sleep 2

# ── 1. 필수항목 미입력 → 에러 표시 ──
scenario_header "상품 등록 - 필수항목 미입력 에러"

ab find role button click --name "등록하기" 2>/dev/null || true
sleep 2

assert_visible_any "카테고리 에러" "카테고리를 선택"
assert_visible_any "브랜드 에러" "브랜드를 선택"
assert_visible_any "상품명 에러" "상품명을 입력"
assert_visible_any "가격 에러" "판매가" "숫자만"
assert_visible_any "설명 에러" "상세 정보"
assert_visible_any "사이즈 에러" "사이즈를 선택"
assert_visible_any "이미지 에러" "이미지를 추가"

# ── 2. 전체 선택/해제 동작 ──
scenario_header "상품 등록 - 전체 선택/해제"

# 사이즈 먼저 선택해야 전체 선택 버튼 동작
ab find role button click --name "260" 2>/dev/null || true
ab find role button click --name "270" 2>/dev/null || true
sleep 1

ab find role button click --name "전체 선택" 2>/dev/null || true
sleep 2

# 재고 일괄 적용 표시 확인
assert_visible "재고 일괄 적용" "전체 선택 후 재고 일괄 적용 표시"

ab find role button click --name "전체 선택 해제" 2>/dev/null || true
sleep 1

assert_not_visible "재고 일괄 적용" "전체 해제 후 재고 일괄 적용 미표시"

# ── 3. 모든 필수항목 입력 → 등록 성공 ──
scenario_header "상품 등록 - 성공"

# 카테고리/브랜드 선택 (container 안의 button을 직접 클릭)
ab eval "document.querySelector('[data-testid=\"category\"] button')?.click()" 2>/dev/null || true
sleep 1
ab find text "운동화" click 2>/dev/null || true
sleep 1
ab eval "document.querySelector('[data-testid=\"brand\"] button')?.click()" 2>/dev/null || true
sleep 1
ab find text "nike" click 2>/dev/null || true
sleep 1

# 기본 정보 입력 (React internal setter로 RHF 상태 업데이트)
ab eval "const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;const el=document.querySelector('[data-testid=\"productName\"]');if(el){el.focus();s.call(el,'테스트 상품');el.dispatchEvent(new InputEvent('input',{bubbles:true}))}" 2>/dev/null || true
ab eval "const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;const el=document.querySelector('[data-testid=\"price\"]');if(el){el.focus();s.call(el,'89000');el.dispatchEvent(new InputEvent('input',{bubbles:true}))}" 2>/dev/null || true
ab eval "const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;const el=document.querySelector('[data-testid=\"description\"]');if(el){el.focus();s.call(el,'테스트용 상세 설명입니다.');el.dispatchEvent(new InputEvent('input',{bubbles:true}))}" 2>/dev/null || true

# 판매 대기 라디오 (value는 "pending")
ab eval "document.querySelector('input[value=\"pending\"]')?.click()" 2>/dev/null || true
sleep 1

# 사이즈 전체 선택 → 재고 일괄 적용 input이 렌더링됨
# (개별 선택 시 all-stock-input이 DOM에 없어 재고 설정 불가)
ab find role button click --name "전체 선택" 2>/dev/null || true
sleep 1

# 재고 일괄 적용 (React internal setter로 RHF 상태 업데이트)
ab eval "const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;const el=document.querySelector('[data-testid=\"all-stock-input\"]');if(el){el.focus();s.call(el,'10');el.dispatchEvent(new InputEvent('input',{bubbles:true}))}" 2>/dev/null || true
sleep 1

# 이미지 업로드 (PNG 픽스처 사용 - accept="image/jpeg, image/jpg, image/png")
if [ -f "${FIXTURE_DIR}/test.png" ]; then
  ab upload "input[type=\"file\"]" "${FIXTURE_DIR}/test.png" 2>/dev/null || true
  sleep 2
fi

# 등록
ab find role button click --name "등록하기" 2>/dev/null || true
sleep 5

assert_visible_any "상품 등록 성공 메시지" "상품 등록이 완료되었습니다" "완료" "성공"

ab_close

# ── 4. 상품 목록 조회 ──
scenario_header "상품 목록 조회"

new_session "qa-admin-product-list"
ab_login_admin || { fail "Admin 로그인 실패"; summary; exit 1; }

ab_open "${ADMIN_URL}/products"
sleep 2

# 조회 버튼 클릭
ab find role button click --name "조회" 2>/dev/null || true
sleep 3

# 상품 테이블 헤더 표시 확인 (데이터 유무와 관계없이 항상 렌더링)
assert_visible_any "상품 목록 표시" "상품명" "판매 상태"
assert_not_visible "상품 데이터가 없습니다" "빈 결과 미표시"

# 기간 필터 기본값 확인 (연도 기준으로 체크)
assert_visible "2025" "시작일 기본값 표시 (2025년)"

ab_close

# ── 결과 ──
summary
