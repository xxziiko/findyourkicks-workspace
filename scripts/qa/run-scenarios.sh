#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# agent-browser QA 시나리오 러너
# Usage: ./scripts/qa/run-scenarios.sh [shop|admin|all]
# Env:   SHOP_URL  (default: http://localhost:3000)
#        ADMIN_URL (default: http://localhost:5173)
#        TEST_ACCOUNT_PW
# ─────────────────────────────────────────────────────────

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:-all}"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

TOTAL_SCENARIOS=0
PASSED_SCENARIOS=0
FAILED_SCENARIOS=0
FAILED_LIST=""

run_scenario() {
  local script="$1"
  local name
  name=$(basename "$script" .sh)
  local dir
  dir=$(basename "$(dirname "$script")")

  TOTAL_SCENARIOS=$((TOTAL_SCENARIOS + 1))

  echo ""
  echo -e "${CYAN}▶ ${dir}/${name}${NC}"

  if bash "$script"; then
    PASSED_SCENARIOS=$((PASSED_SCENARIOS + 1))
  else
    FAILED_SCENARIOS=$((FAILED_SCENARIOS + 1))
    FAILED_LIST="${FAILED_LIST}\n  - ${dir}/${name}"
  fi

  # 시나리오 간 쿨다운 (리소스 안정화)
  sleep 2
}

echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN}  agent-browser QA 시나리오 러너${NC}"
echo -e "${CYAN}  대상: ${TARGET}${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}"

# Shop 시나리오
if [ "$TARGET" = "shop" ] || [ "$TARGET" = "all" ]; then
  echo ""
  echo -e "${CYAN}─── Shop 시나리오 ───${NC}"
  for script in "${SCRIPT_DIR}/scenarios/shop/"*.sh; do
    [ -f "$script" ] && run_scenario "$script"
  done
fi

# Admin 시나리오
if [ "$TARGET" = "admin" ] || [ "$TARGET" = "all" ]; then
  echo ""
  echo -e "${CYAN}─── Admin 시나리오 ───${NC}"
  for script in "${SCRIPT_DIR}/scenarios/admin/"*.sh; do
    [ -f "$script" ] && run_scenario "$script"
  done
fi

# 최종 요약
echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN}  최종 결과${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "  시나리오: ${TOTAL_SCENARIOS}개"
echo -e "  ${GREEN}통과: ${PASSED_SCENARIOS}${NC}  ${RED}실패: ${FAILED_SCENARIOS}${NC}"

if [ "$FAILED_SCENARIOS" -gt 0 ]; then
  echo -e "\n${RED}실패한 시나리오:${FAILED_LIST}${NC}"
  echo ""
  exit "$FAILED_SCENARIOS"
else
  echo ""
  echo -e "${GREEN}모든 시나리오가 통과했습니다.${NC}"
  echo ""
  exit 0
fi
