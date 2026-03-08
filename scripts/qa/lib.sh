#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# agent-browser QA 공통 라이브러리
# 모든 시나리오 스크립트에서 source하여 사용
# ─────────────────────────────────────────────────────────

set -euo pipefail

# ── 색상 ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ── 카운터 ──
PASS_COUNT=0
FAIL_COUNT=0
TOTAL_COUNT=0

# ── 환경변수 기본값 ──
SHOP_URL="${SHOP_URL:-http://localhost:3000}"
ADMIN_URL="${ADMIN_URL:-http://localhost:5173}"
SESSION="${SESSION:-qa-default}"

# ─────────────────────────────────────────────────────────
# 결과 출력
# ─────────────────────────────────────────────────────────

pass() {
  PASS_COUNT=$((PASS_COUNT + 1))
  TOTAL_COUNT=$((TOTAL_COUNT + 1))
  echo -e "  ${GREEN}✓${NC} $1"
}

fail() {
  FAIL_COUNT=$((FAIL_COUNT + 1))
  TOTAL_COUNT=$((TOTAL_COUNT + 1))
  echo -e "  ${RED}✗${NC} $1"
}

scenario_header() {
  echo ""
  echo -e "${CYAN}━━━ $1 ━━━${NC}"
}

summary() {
  echo ""
  echo -e "${CYAN}━━━ 결과 요약 ━━━${NC}"
  echo -e "  전체: ${TOTAL_COUNT}  ${GREEN}통과: ${PASS_COUNT}${NC}  ${RED}실패: ${FAIL_COUNT}${NC}"
  echo ""

  # 세션 정리
  agent-browser close --session "$SESSION" 2>/dev/null || true

  if [ "$FAIL_COUNT" -gt 0 ]; then
    echo -e "${RED}QA 실패: ${FAIL_COUNT}건의 실패가 있습니다.${NC}"
    return 1
  else
    echo -e "${GREEN}QA 통과: 모든 시나리오가 성공했습니다.${NC}"
    return 0
  fi
}

# ─────────────────────────────────────────────────────────
# agent-browser 래퍼
# ─────────────────────────────────────────────────────────

ab() {
  agent-browser --session "$SESSION" "$@"
}

ab_open() {
  local url="$1"
  local retries=0
  while [ $retries -lt 3 ]; do
    if ab open "$url" 2>/dev/null; then
      ab wait --load load 2>/dev/null || sleep 2
      return 0
    fi
    retries=$((retries + 1))
    sleep 2
  done
  # 최종 fallback
  ab open "$url"
  sleep 3
}

ab_snapshot() {
  ab snapshot "$@"
}

ab_click() {
  ab click "$@"
}

ab_fill() {
  ab fill "$@"
}

ab_get_url() {
  ab get url
}

ab_close() {
  ab close 2>/dev/null || true
}

# ─────────────────────────────────────────────────────────
# 인증 헬퍼
# ─────────────────────────────────────────────────────────

ab_login_shop() {
  ab_open "${SHOP_URL}/login"
  ab find role button click --name "테스트 계정으로 로그인"
  # 리다이렉트 대기
  local retries=0
  while [ $retries -lt 15 ]; do
    local url
    url=$(ab_get_url 2>/dev/null || echo "")
    if echo "$url" | grep -qv "/login"; then
      return 0
    fi
    sleep 1
    retries=$((retries + 1))
  done
  return 1
}

ab_login_admin() {
  local email="${1:-admin@example.com}"
  local password="${2:-admin123}"

  ab_open "${ADMIN_URL}/login"
  ab find label "이메일" fill "$email"
  ab find label "비밀번호" fill "$password"
  ab find role button click --name "로그인"
  # 리다이렉트 대기
  local retries=0
  while [ $retries -lt 15 ]; do
    local url
    url=$(ab_get_url 2>/dev/null || echo "")
    if echo "$url" | grep -qv "/login"; then
      return 0
    fi
    sleep 1
    retries=$((retries + 1))
  done
  return 1
}

# ─────────────────────────────────────────────────────────
# Assert 함수
# ─────────────────────────────────────────────────────────

assert_url() {
  local pattern="$1"
  local label="${2:-URL이 '$pattern'과 일치}"

  local url
  url=$(ab_get_url 2>/dev/null || echo "FAILED_TO_GET_URL")

  if echo "$url" | grep -qE "$pattern"; then
    pass "$label"
  else
    fail "$label (실제: $url)"
  fi
}

assert_visible() {
  local label="$1"
  local desc="${2:-'$label' 표시 확인}"

  local snapshot
  snapshot=$(ab_snapshot 2>/dev/null || echo "")

  if echo "$snapshot" | grep -qi "$label"; then
    pass "$desc"
  else
    fail "$desc (스냅샷에서 '$label'을 찾을 수 없음)"
  fi
}

assert_not_visible() {
  local label="$1"
  local desc="${2:-'$label' 미표시 확인}"

  local snapshot
  snapshot=$(ab_snapshot 2>/dev/null || echo "")

  if echo "$snapshot" | grep -qi "$label"; then
    fail "$desc (스냅샷에서 '$label'이 발견됨)"
  else
    pass "$desc"
  fi
}

assert_visible_any() {
  local desc="$1"
  shift
  local snapshot
  snapshot=$(ab_snapshot 2>/dev/null || echo "")

  for label in "$@"; do
    if echo "$snapshot" | grep -qi "$label"; then
      pass "$desc ('$label' 발견)"
      return 0
    fi
  done
  fail "$desc (어떤 항목도 찾을 수 없음)"
}

assert_status() {
  local method="$1"
  local url="$2"
  local expected_pattern="$3"
  local desc="${4:-$method $url → $expected_pattern}"

  local status
  if [ "$method" = "GET" ]; then
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
  else
    status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url" 2>/dev/null || echo "000")
  fi

  if echo "$status" | grep -qE "$expected_pattern"; then
    pass "$desc (${status})"
  else
    fail "$desc (예상: ${expected_pattern}, 실제: ${status})"
  fi
}

assert_json_field() {
  local url="$1"
  local field="$2"
  local expected="$3"
  local desc="${4:-$field = $expected}"

  local body
  body=$(curl -s "$url" 2>/dev/null || echo "{}")

  local actual
  actual=$(echo "$body" | grep -o "\"$field\":[^,}]*" | head -1 | sed "s/\"$field\"://;s/\"//g;s/ //g")

  if [ "$actual" = "$expected" ]; then
    pass "$desc"
  else
    fail "$desc (예상: $expected, 실제: $actual)"
  fi
}

# ─────────────────────────────────────────────────────────
# 유틸리티
# ─────────────────────────────────────────────────────────

wait_for_url_change() {
  local pattern="$1"
  local timeout="${2:-15}"
  local retries=0

  while [ $retries -lt "$timeout" ]; do
    local url
    url=$(ab_get_url 2>/dev/null || echo "")
    if echo "$url" | grep -qE "$pattern"; then
      return 0
    fi
    sleep 1
    retries=$((retries + 1))
  done
  return 1
}

new_session() {
  local name="$1"
  # 기존 세션 정리 후 새 세션 시작
  agent-browser close --session "$name" 2>/dev/null || true
  SESSION="$name"
}
