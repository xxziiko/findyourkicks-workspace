#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Shop 인증 시나리오
# ← login.setup.ts + login.test.ts + login.public.test.ts
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../../lib.sh"

SESSION="${SESSION:-qa-shop-auth}"
scenario_header "Shop 인증 테스트"

# ── 1. 테스트 계정 로그인 성공 ──
new_session "qa-shop-auth-login"
ab_open "${SHOP_URL}/login"
ab find role button click --name "테스트 계정으로 로그인"
wait_for_url_change "[^/]/$" 15 || true
assert_url "${SHOP_URL}/?$" "테스트 계정 로그인 → 메인 리다이렉트"
assert_visible "LOGOUT" "로그인 후 LOGOUT 버튼 표시"

# ── 2. 인증 상태에서 /login 접근 → / 리다이렉트 ──
ab_open "${SHOP_URL}/login"
sleep 3
wait_for_url_change "/" 15 || true
sleep 2
current_url=$(ab eval "window.location.href" 2>/dev/null | tr -d '"')
if echo "$current_url" | grep -qv "/login"; then
  pass "인증 상태 /login → / 리다이렉트"
else
  # 리다이렉트가 느릴 수 있으므로 한번 더 대기
  sleep 5
  current_url=$(ab eval "window.location.href" 2>/dev/null | tr -d '"')
  if echo "$current_url" | grep -qv "/login"; then
    pass "인증 상태 /login → / 리다이렉트"
  else
    fail "인증 상태 /login → / 리다이렉트 (실제: $current_url)"
  fi
fi
assert_visible "LOGOUT" "리다이렉트 후 LOGOUT 표시"
ab_close

# ── 3. 카카오 로그인 버튼 → kakao.com 리다이렉트 ──
new_session "qa-shop-auth-kakao"
ab_open "${SHOP_URL}/login"
assert_visible "카카오계정으로 로그인" "카카오 로그인 버튼 표시"
ab find role button click --name "카카오계정으로 로그인"
wait_for_url_change "kakao" 10 || true
assert_url "kakao\\.com" "카카오 로그인 → kakao.com 리다이렉트"
ab_close

# ── 4. 구글 로그인 버튼 → google.com 리다이렉트 ──
new_session "qa-shop-auth-google"
ab_open "${SHOP_URL}/login"
assert_visible "구글계정으로 로그인" "구글 로그인 버튼 표시"
ab find role button click --name "구글계정으로 로그인"
wait_for_url_change "google" 10 || true
assert_url "accounts\\.google\\.com" "구글 로그인 → google.com 리다이렉트"
ab_close

# ── 결과 ──
summary
