# Plan: Playwright → agent-browser 전환 및 QA 자동화 구축

## Context

**현재 상태:** Playwright 기반 E2E 테스트 (shop 19 cases + admin 7 cases)가 pre-push hook과 GitHub Actions에서 실행됨. 배포 후 QA는 없음.

**목표:** Playwright를 완전히 제거하고, `agent-browser` CLI 기반의 3계층 QA 아키텍처를 구축:

```
[Layer 1] Claude Code 스킬 (/qa-browser, /ship)
  → AI가 git diff 분석 → 관련 시나리오 실행 → 이상 없으면 commit + PR
  → 개발 중 수동 호출 또는 /ship 명령으로 자동화

[Layer 2] Pre-push hook (결정론적)
  → agent-browser 셸 스크립트로 핵심 시나리오 실행
  → 기존 Playwright 테스트를 1:1 대체

[Layer 3] CI/CD (GitHub Actions)
  → PR: agent-browser 스모크 테스트
  → 배포 후: 프로덕션 URL 대상 스모크 테스트
```

---

## Phase 1: 프로젝트 기반 설정

### 1-1. `agent-browser.json` (신규)

```json
{
  "headed": false,
  "defaultTimeout": 30000,
  "downloadPath": "./test-results"
}
```

### 1-2. 디렉토리 구조

```
scripts/qa/
├── lib.sh                    # 공통 유틸 (assert, 세션, 색상 출력)
├── run-scenarios.sh          # 전체 시나리오 러너
├── scenarios/
│   ├── shop/
│   │   ├── auth.sh           # ← login.setup + login.test + login.public.test
│   │   ├── cart.sh           # ← cart-flow.test
│   │   ├── search.sh         # ← search-filter.test
│   │   ├── review.sh         # ← review.test
│   │   └── order.sh          # ← order-cancel.test
│   └── admin/
│       ├── auth.sh           # ← login.setup + login.test
│       └── product.sh        # ← productRegister.test
```

---

## Phase 2: 공통 라이브러리 (`scripts/qa/lib.sh`)

모든 시나리오가 source하는 공통 함수:

```bash
ab()                  # agent-browser wrapper (--session 자동 부여)
ab_open()             # open + wait for load
ab_login_shop()       # shop 테스트 계정 로그인 플로우
ab_login_admin()      # admin 이메일/PW 로그인 플로우
assert_url()          # URL 패턴 매칭 검증
assert_visible()      # snapshot에서 텍스트/요소 존재 확인 (grep 기반)
assert_not_visible()  # snapshot에서 요소 부재 확인
assert_status()       # curl 기반 HTTP 상태 코드 검증
pass() / fail()       # 결과 카운터 + 출력
summary()             # 전체 결과 요약, 실패 시 non-zero exit
```

`assert_visible` 핵심 구현:
```bash
assert_visible() {
  local label="$1"
  local snapshot=$(agent-browser snapshot --session "$SESSION" --json)
  if echo "$snapshot" | grep -qi "$label"; then
    pass "$label 존재 확인"
  else
    fail "$label 을 찾을 수 없음"
  fi
}
```

---

## Phase 3: 시나리오 1:1 마이그레이션

### Shop 시나리오

#### `shop/auth.sh` (← login.setup + login.test + login.public.test: 5 cases)

| # | 검증 내용 | agent-browser 구현 |
|---|---|---|
| 1 | 테스트 계정 로그인 성공 | `ab open /login` → `ab find role button click "테스트 계정으로 로그인"` → `assert_url "/$"` → `assert_visible "LOGOUT"` |
| 2 | 인증 상태 /login → / 리다이렉트 | (인증 세션) `ab open /login` → `assert_url "/$"` |
| 3 | 카카오 버튼 → kakao.com | `ab find role button click "카카오계정으로 로그인"` → `assert_url "kakao.com"` |
| 4 | 구글 버튼 → google.com | `ab find role button click "구글계정으로 로그인"` → `assert_url "accounts.google.com"` |
| 5 | 테스트 계정 → 메인 리다이렉트 | #1과 동일 플로우 |

#### `shop/cart.sh` (← cart-flow.test: 4 cases)

| # | 검증 내용 | agent-browser 구현 |
|---|---|---|
| 1 | 사이즈 선택 → 장바구니 추가 → 카운트 증가 | `ab open /` → 첫 상품 클릭 → 사이즈 버튼 클릭 → `ab find role button click "장바구니"` → badge 텍스트 검증 |
| 2 | /cart 접근 → 목록 표시 | `ab open /cart` → `assert_visible "상품/옵션 정보"` OR `"장바구니가 비어있어요!"` |
| 3 | 장바구니에 상품 → 주문하기 버튼 | 상품 추가 후 /cart → `assert_visible "주문하기"` |
| 4 | 주문하기 → /checkout 이동 | `ab find role button click "주문하기"` → `assert_url "/checkout/"` |

#### `shop/search.sh` (← search-filter.test: 4 cases)

| # | 검증 내용 | agent-browser 구현 |
|---|---|---|
| 1 | /products 로드 확인 | `ab open /products` → `assert_visible "상품 검색"` + `assert_visible "정렬 방식"` |
| 2 | 검색 → URL ?q= 반영 | `ab find role searchbox fill "nike"` → `ab wait 500` → `assert_url "q=nike"` |
| 3 | 정렬 → URL ?sort= 반영 | `ab find role combobox select "price_asc"` → `assert_url "sort=price_asc"` |
| 4 | 상품 목록 렌더링 | `ab snapshot` → product links OR empty message 확인 |

#### `shop/review.sh` (← review.test: 3 cases)

| # | 검증 내용 | agent-browser 구현 |
|---|---|---|
| 1 | 상품 상세 → 리뷰 섹션 | 상품 클릭 → `assert_visible "리뷰"` |
| 2 | 비인증 eligibility API | `curl ... /eligibility` → JSON body에서 `canReview: false` 검증 |
| 3 | 비인증 → 리뷰 작성 버튼 없음 | 상품 상세 → `assert_not_visible "리뷰 작성"` |

#### `shop/order.sh` (← order-cancel.test: 4 cases)

| # | 검증 내용 | agent-browser 구현 |
|---|---|---|
| 1 | 비인증 /my/orders → /login | 새 세션 → `ab open /my/orders` → `assert_url "/login"` |
| 2 | 비인증 /my/orders/[id] → /login | 새 세션 → `ab open /my/orders/test-id` → `assert_url "/login"` |
| 3 | 비인증 주문 취소 API → 4xx | `assert_status "POST .../cancel" "4[0-9][0-9]"` |
| 4 | 비인증 반품 API → 4xx | `assert_status "POST .../return" "4[0-9][0-9]"` |

### Admin 시나리오

#### `admin/auth.sh` (← login.setup + login.test: 2 cases)

| # | 검증 내용 | agent-browser 구현 |
|---|---|---|
| 1 | 로그인 성공 → 대시보드 | `ab open /login` → email/pw fill → `ab find role button click "로그인"` → `assert_visible "반갑습니다"` |
| 2 | 잘못된 자격증명 → 에러 | wrong email/pw → click → `assert_visible` (error elements) |

#### `admin/product.sh` (← productRegister.test: 3 cases)

| # | 검증 내용 | agent-browser 구현 |
|---|---|---|
| 1 | 필수항목 입력 → 등록 성공 | 카테고리/브랜드 선택 → 이름/가격/설명 fill → 사이즈 click → 재고 fill → `ab upload` (이미지) → `ab find role button click "등록하기"` → `assert_visible "상품 등록이 완료되었습니다."` |
| 2 | 필수항목 미입력 → 에러 | 바로 등록하기 click → 각 필드 에러 assert |
| 3 | 전체 선택/해제 | `ab find role button click "전체 선택"` → disabled 확인 → `"전체 선택 해제"` → enabled 확인 |

---

## Phase 4: 시나리오 러너 (`scripts/qa/run-scenarios.sh`)

```bash
#!/usr/bin/env bash
# Usage: ./scripts/qa/run-scenarios.sh [shop|admin|all]
# Env: SHOP_URL (default: http://localhost:3000)
#      ADMIN_URL (default: http://localhost:5173)
#      TEST_ACCOUNT_PW

TARGET="${1:-all}"
# 대상에 따라 scenarios/shop/*.sh, scenarios/admin/*.sh 순차 실행
# 각 시나리오는 독립 세션 (--session scenario-name)
# 종료 코드 = 실패 시나리오 수 (0 = 전체 통과)
```

---

## Phase 5: Claude Code 스킬

### 5-1. `.claude/commands/qa-browser.md` (신규)

AI-driven 탐색적 QA. `$ARGUMENTS`로 대상(shop/admin/all) 지정.

핵심 동작:
1. `git diff --name-only HEAD` → 변경 파일 파악
2. 변경 영역 → 관련 시나리오 매핑:
   - `features/auth/**` → auth.sh
   - `features/cart/**` → cart.sh
   - `features/product/**` → search.sh, product.sh
   - `features/review/**` → review.sh
   - `features/order/**` → order.sh
   - shared → 전체
3. `bash scripts/qa/run-scenarios.sh` 로 해당 시나리오 실행
4. 추가로 agent-browser `snapshot -i`로 탐색적 검증
5. `[PASS]` / `[FAIL]` 리포트 출력

### 5-2. `.claude/commands/ship.md` (신규)

QA → Commit → PR 원스톱 워크플로:
1. dev 서버 실행 여부 확인
2. `/qa-browser` 실행 (변경 영역 QA)
3. 전체 통과 시 → stage → commit → push → `gh pr create`
4. 실패 시 → 에러 리포트 + 중단

---

## Phase 6: Git Hook 전환

### `.husky/pre-push` (수정)

```bash
#!/usr/bin/env sh

# 1. 빌드
pnpm run build || exit 1

# 2. agent-browser QA (shop)
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1
pnpm --filter shop dev &
SHOP_PID=$!
for i in $(seq 1 60); do
  curl -s http://localhost:3000 > /dev/null && break; sleep 2
done

bash scripts/qa/run-scenarios.sh shop
EXIT_CODE=$?
kill $SHOP_PID 2>/dev/null
exit $EXIT_CODE
```

---

## Phase 7: CI/CD 통합

### `.github/workflows/e2e-test.yml` (수정)

Playwright → agent-browser 교체:
```yaml
- name: Install agent-browser
  run: npm install -g agent-browser && agent-browser install --with-deps
- name: Run QA scenarios
  run: |
    pnpm --filter shop dev &
    npx wait-on http://localhost:3000 --timeout 120000
    bash scripts/qa/run-scenarios.sh shop
```

### `.github/workflows/unified-deploy.yml` (수정)

deploy 완료 후 smoke-test job 추가:
```yaml
smoke-test:
  needs: [deploy]
  if: always() && needs.deploy.result == 'success'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: 20 }
    - run: npm install -g agent-browser && agent-browser install --with-deps
    - run: bash scripts/qa/run-scenarios.sh all
      env:
        SHOP_URL: ${{ secrets.SHOP_BASE_URL }}
        ADMIN_URL: ${{ secrets.ADMIN_BASE_URL }}
        TEST_ACCOUNT_PW: ${{ secrets.TEST_ACCOUNT_PW }}
```

---

## Phase 8: Playwright 제거

시나리오 전체 안정 확인 후:

**삭제:**
- `playwright.config.ts`
- `apps/shop/src/tests/` (전체)
- `apps/admin/src/tests/` (전체)
- `apps/shop/storageState.json`, `apps/admin/storageState.json`

**`package.json` 수정:**
- devDeps 제거: `@playwright/test`, `playwright`
- scripts 제거: `test:admin`, `test:shop`
- scripts 추가:
```json
{
  "qa": "bash scripts/qa/run-scenarios.sh all",
  "qa:shop": "bash scripts/qa/run-scenarios.sh shop",
  "qa:admin": "bash scripts/qa/run-scenarios.sh admin"
}
```

---

## 구현 순서

| Step | 작업 | 파일 |
|------|------|------|
| 1 | 프로젝트 설정 + 디렉토리 | `agent-browser.json` |
| 2 | 공통 라이브러리 | `scripts/qa/lib.sh` |
| 3 | Shop 시나리오 5개 | `scripts/qa/scenarios/shop/*.sh` |
| 4 | Admin 시나리오 2개 | `scripts/qa/scenarios/admin/*.sh` |
| 5 | 시나리오 러너 | `scripts/qa/run-scenarios.sh` |
| 6 | 로컬 검증 (dev 서버 + 시나리오 실행) | — |
| 7 | Claude Code 스킬 | `.claude/commands/qa-browser.md`, `ship.md` |
| 8 | pre-push hook 전환 | `.husky/pre-push` |
| 9 | CI 워크플로 수정 | `.github/workflows/*.yml` |
| 10 | Playwright 제거 | `playwright.config.ts`, `package.json`, test dirs |

---

## 검증

### 로컬
1. `pnpm dev:shop && pnpm dev:admin`
2. `bash scripts/qa/run-scenarios.sh all` → 전체 통과
3. Claude Code에서 `/qa-browser shop` → AI QA 동작
4. `/ship "test: agent-browser QA"` → 전체 플로우

### CI
1. PR → e2e-test.yml agent-browser 시나리오 통과
2. main 머지 → deploy → smoke-test job 통과

### 완료 기준
- 기존 Playwright 24 cases 전부 agent-browser 커버
- pre-push + CI에서 전체 통과
- `playwright` 패키지 완전 제거 후 파이프라인 정상

---

## 파일 경로 요약

| 파일 | 상태 |
|------|------|
| `agent-browser.json` | 신규 |
| `scripts/qa/lib.sh` | 신규 |
| `scripts/qa/run-scenarios.sh` | 신규 |
| `scripts/qa/scenarios/shop/auth.sh` | 신규 |
| `scripts/qa/scenarios/shop/cart.sh` | 신규 |
| `scripts/qa/scenarios/shop/search.sh` | 신규 |
| `scripts/qa/scenarios/shop/review.sh` | 신규 |
| `scripts/qa/scenarios/shop/order.sh` | 신규 |
| `scripts/qa/scenarios/admin/auth.sh` | 신규 |
| `scripts/qa/scenarios/admin/product.sh` | 신규 |
| `.claude/commands/qa-browser.md` | 신규 |
| `.claude/commands/ship.md` | 신규 |
| `.husky/pre-push` | 수정 |
| `.github/workflows/e2e-test.yml` | 수정 |
| `.github/workflows/unified-deploy.yml` | 수정 |
| `package.json` | 수정 |
| `playwright.config.ts` | 삭제 |
| `apps/shop/src/tests/` | 삭제 |
| `apps/admin/src/tests/` | 삭제 |
