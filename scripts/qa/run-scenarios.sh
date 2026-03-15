#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# agent-browser QA 시나리오 러너
#
# Usage:
#   ./scripts/qa/run-scenarios.sh shop            # shop 전체
#   ./scripts/qa/run-scenarios.sh admin           # admin 전체
#   ./scripts/qa/run-scenarios.sh all             # 전체
#   ./scripts/qa/run-scenarios.sh shop/review     # 특정 시나리오
#   ./scripts/qa/run-scenarios.sh shop/review shop/cart admin/product
#
# Env:   SHOP_URL  (default: http://localhost:3000)
#        ADMIN_URL (default: http://localhost:5173)
#        TEST_ACCOUNT_PW
# ─────────────────────────────────────────────────────────

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

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

# 인수가 없으면 all
if [ $# -eq 0 ]; then
  set -- "all"
fi

# 대상 레이블 (헤더 출력용)
LABEL="$*"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN}  agent-browser QA 시나리오 러너${NC}"
echo -e "${CYAN}  대상: ${LABEL}${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}"

for TARGET in "$@"; do
  if [[ "$TARGET" == *"/"* ]]; then
    # ── 특정 시나리오 (e.g. shop/review, admin/product) ──
    script="${SCRIPT_DIR}/scenarios/${TARGET}.sh"
    if [ -f "$script" ]; then
      group=$(dirname "$TARGET")
      echo ""
      echo -e "${CYAN}─── ${group} 시나리오 ───${NC}"
      run_scenario "$script"
    else
      echo -e "${RED}시나리오를 찾을 수 없습니다: ${TARGET}${NC}"
    fi
  elif [ "$TARGET" = "shop" ] || [ "$TARGET" = "all" ]; then
    # ── Shop 전체 ──
    echo ""
    echo -e "${CYAN}─── Shop 시나리오 ───${NC}"
    for script in "${SCRIPT_DIR}/scenarios/shop/"*.sh; do
      [ -f "$script" ] && run_scenario "$script"
    done
  fi

  if [ "$TARGET" = "admin" ] || [ "$TARGET" = "all" ]; then
    # ── Admin 전체 ──
    echo ""
    echo -e "${CYAN}─── Admin 시나리오 ───${NC}"
    for script in "${SCRIPT_DIR}/scenarios/admin/"*.sh; do
      [ -f "$script" ] && run_scenario "$script"
    done
  fi
done

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
