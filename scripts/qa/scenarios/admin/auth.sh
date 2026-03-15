#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Admin 인증 시나리오
# ← login.setup.ts + login.test.ts
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../../lib.sh"

SESSION="${SESSION:-qa-admin-auth}"
scenario_header "Admin 인증 테스트"

# ── 1. 로그인 성공 → 대시보드 리다이렉트 ──
new_session "qa-admin-auth-ok"
ab_open "${ADMIN_URL}/login"

ab find label "이메일" fill "admin@example.com" 2>/dev/null || true
ab find label "비밀번호" fill "admin123" 2>/dev/null || true
ab find role button click --name "로그인" 2>/dev/null || true

wait_for_url_change "${ADMIN_URL}/?$" 15 || true
assert_url "${ADMIN_URL}/?$" "로그인 성공 → 대시보드 리다이렉트"

# 대시보드 컴포넌트 렌더링 대기 (CI 환경에서는 Supabase 쿼리 느림)
retries=0
while [ $retries -lt 10 ]; do
  if ab snapshot 2>/dev/null | grep -q "상품 통계"; then break; fi
  sleep 2
  retries=$((retries + 1))
done

assert_visible "상품 통계" "대시보드에 상품 통계 표시"
ab_close

# ── 2. 잘못된 자격증명 → 에러 메시지 ──
new_session "qa-admin-auth-fail"
ab_open "${ADMIN_URL}/login"

ab find label "이메일" fill "wrong@example.com" 2>/dev/null || true
ab find label "비밀번호" fill "wrongpass" 2>/dev/null || true
ab find role button click --name "로그인" 2>/dev/null || true
sleep 2

assert_visible_any "로그인 에러 표시" "email-error" "password-error" "에러" "오류" "일치하지"
ab_close

# ── 결과 ──
summary
