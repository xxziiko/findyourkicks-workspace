# Plan: agent-browser QA 자동화 구축

## Context

현재 CI/CD 파이프라인은 아래 구조를 가짐:
- **pre-commit**: lint + typecheck
- **pre-push**: build + Playwright E2E (shop 앱만)
- **GitHub Actions PR**: build + E2E (fix/ci 브랜치 한정)
- **GitHub Actions main → EC2**: Docker build → deploy (post-deploy QA 없음)

**문제**: 배포 후 실제 서비스가 정상 동작하는지 확인하는 자동화된 QA 단계가 없음.

**목표**: `agent-browser` CLI를 활용해 두 가지 QA 레이어를 구축:
1. 로컬 개발 중 Claude 에이전트가 agent-browser로 탐색적 QA 수행하는 스킬
2. CI/CD post-deploy에 스모크 테스트 자동 실행

---

## 아키텍처

```
로컬:  /qa-browser [shop|admin|all]
         → Claude가 agent-browser CLI를 Bash로 호출
         → 스냅샷 해석 → 문제 리포트 → (선택) Playwright 스텁 생성

CI/CD: unified-deploy.yml deploy job 완료 후
         → smoke-test.sh 실행 (agent-browser로 EC2 URLs 검증)
         → 실패 시 워크플로우 실패로 기록
```

---

## 생성/수정할 파일

### 1. `.claude/commands/qa-browser.md` (신규)

로컬에서 Claude가 직접 실행하는 탐색적 QA 스킬.

**동작 방식:**
- `$ARGUMENTS`로 대상 지정: `shop`, `admin`, `all`
- Claude가 Bash로 `agent-browser` 명령 순차 실행
- `snapshot` 출력을 해석해 UI/기능 이상 감지
- 인증이 필요한 페이지는 `--state` 옵션으로 storageState 파일 로드

**핵심 QA 플로우 (shop):**
1. `agent-browser open http://localhost:3000 && agent-browser snapshot`
2. 상품 목록 페이지 (`/products`) 로드 확인
3. 상품 상세 (`/product/[id]`) → 사이즈 선택 → 장바구니 추가
4. 장바구니 페이지 확인
5. 로그인 후 리뷰 폼 접근 확인

**핵심 QA 플로우 (admin):**
1. 로그인 페이지 접근
2. 대시보드 렌더링 확인
3. 상품 등록 폼 접근 확인
4. 반품 관리 테이블 확인

**출력**: 이슈 목록 (페이지, 예상 상태, 실제 상태)

### 2. `scripts/qa/smoke-test.sh` (신규)

CI에서 자동 실행 가능한 결정론적 스모크 테스트. Claude 없이 순수 agent-browser CLI만 사용.

**파라미터:**
- `SHOP_URL` (기본: `http://localhost:3000`)
- `ADMIN_URL` (기본: `http://localhost:5173`)
- `TEST_ACCOUNT_PW` (환경변수)

**검증 항목 (shop):**
- 홈페이지 200 응답 + 상품 링크 존재
- `/products` 페이지 로드
- `/login` 페이지 폼 렌더링

**검증 항목 (admin):**
- `/login` 페이지 접근
- 로그인 성공 → 대시보드 리다이렉트

**종료 코드**: 실패 항목 있으면 non-zero exit

### 3. `.github/workflows/unified-deploy.yml` (수정)

`deploy` job 이후 `smoke-test` job 추가:

```yaml
smoke-test:
  needs: [deploy]
  if: always() && needs.deploy.result == 'success'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
    - name: Install agent-browser
      run: npm install -g agent-browser && agent-browser install
    - name: Run smoke tests
      env:
        SHOP_URL: ${{ secrets.SHOP_BASE_URL }}
        ADMIN_URL: ${{ secrets.ADMIN_BASE_URL }}
        TEST_ACCOUNT_PW: ${{ secrets.TEST_ACCOUNT_PW }}
      run: bash scripts/qa/smoke-test.sh
```

---

## 구현 세부 사항

### auth 전략

agent-browser의 `auth save` vault 대신, 기존 Playwright `storageState.json`과 호환되는 `--state` 옵션 활용:
```bash
agent-browser --state apps/shop/storageState.json open http://localhost:3000/orders
```

CI에서는 환경변수로 자격증명을 받아 `agent-browser fill/click`으로 직접 로그인.

### qa-browser.md 명령 구조

```
description: agent-browser로 shop/admin QA를 수행합니다
argument-hint: shop | admin | all
```

Claude는 다음 도구를 사용:
- `Bash`: agent-browser CLI 호출 (`open`, `snapshot`, `fill`, `click`, `find`, `get text`)
- `mcp__conductor__AskUserQuestion`: 이슈 발견 시 사용자 확인

---

## 검증 방법

### 로컬 검증
1. dev 서버 시작: `pnpm dev:shop` + `pnpm dev:admin`
2. `/qa-browser shop` 실행 → Claude가 shop QA 수행
3. `/qa-browser admin` 실행

### CI 검증
1. `scripts/qa/smoke-test.sh` 수동 실행 (dev 서버 켠 상태)
2. PR 생성 → GitHub Actions에서 deploy + smoke-test job 확인

---

## 파일 경로 요약

| 파일 | 상태 |
|------|------|
| `.claude/commands/qa-browser.md` | 신규 생성 |
| `scripts/qa/smoke-test.sh` | 신규 생성 |
| `.github/workflows/unified-deploy.yml` | smoke-test job 추가 |
