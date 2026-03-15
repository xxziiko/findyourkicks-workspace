# FindYourKicks

스니커즈 이커머스 플랫폼: 고객용 Shop + 관리자용 Admin.

## 프로젝트 구조

```
apps/
  shop/          # Next.js 15 (App Router, Turbopack) — 고객 스토어프론트
  admin/         # React 19 + Vite 6 + React Router — 관리자 대시보드
packages/
  shared/        # 공유 UI 컴포넌트, hooks, utils (src/ 없음, 루트에 바로 위치)
  config/        # 공유 tsconfig
playwright/      # Admin E2E 테스트
  tests/admin/   # Admin E2E specs (*.spec.ts)
  pages/         # Page Object Models (AdminPage.ts)
  auth/          # Auth setup (admin.setup.ts)
.specs/          # SDD 스펙 파일 (feature별 requirements/design/tasks)
```

## 기술 스택

- **런타임**: React 19, TypeScript 5.8 (strict)
- **Shop**: Next.js 15 (App Router), fetch API 클라이언트, Supabase SSR
- **Admin**: Vite 6, axios API 클라이언트 (Supabase 세션 인터셉터), React Router 7, Ant Design 5
- **상태관리**: TanStack Query (서버 상태, staleTime 60분) + Jotai (클라이언트 상태)
- **폼**: React Hook Form + Zod 유효성 검증
- **백엔드**: Supabase (Auth, Database, Storage, RPC)
- **모노레포**: pnpm workspaces + Turborepo

## 코드 컨벤션

- **포맷/린트**: Biome (작은따옴표, 2칸 들여쓰기, 세미콜론, trailing comma)
- **커밋**: 컨벤셔널 커밋 (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`)
- **피처 구조**: `features/<domain>/{apis.ts, components/, hooks/, types.ts, index.ts}`
- **경로 별칭**: `@/` → `src/` (양쪽 앱 모두)

## API 패턴

- **Shop**: `shared/utils/api.ts`의 fetch 래퍼 → `features/<domain>/apis.ts` → TanStack Query hooks
- **Admin**: `shared/lib/axios.ts`의 axios 인스턴스 (Supabase 세션 인터셉터) → `features/<domain>/api/` → TanStack Query hooks

## 테스트 전략

### 단위 테스트 (Vitest) — Shop
- 설정: `apps/shop/vitest.config.ts` (jsdom)
- 위치: 소스 옆 co-locate, `__tests__/<name>.test.ts`
- 실행: `pnpm --filter shop test`

### E2E 테스트 (Playwright) — Admin
- 설정: `playwright.config.ts` (루트)
- 위치: `playwright/tests/admin/*.spec.ts`
- 페이지 오브젝트: `playwright/pages/AdminPage.ts`
- 실행: `pnpm test:admin`

### E2E 테스트 (Playwright) — Shop
- 위치: `apps/shop/src/tests/*.test.ts` (vitest에서 제외됨)
- 실행: `pnpm test:shop`

## 검증 명령어

```bash
pnpm run check-types          # TypeScript (tsc --noEmit)
pnpm run lint --quiet          # Biome lint
pnpm run build                 # 전체 빌드 (turbo)
pnpm --filter shop test        # Vitest 단위 테스트
pnpm test:admin                # Playwright Admin E2E
pnpm test:shop                 # Playwright Shop E2E
```

## 기본 작업 방식

기능 구현, 버그 수정, 리팩토링 등 코드 변경이 필요한 작업은 **`/tdd-run` 파이프라인을 기본 executor로 사용**한다.

```
/tdd-run "기능 설명 또는 작업 내용"
```

이 executor는 아래 파이프라인을 반자동으로 실행한다:
1. **SPEC** — 코드베이스 분석 + 명세 생성 → 🛑 사용자 승인
2. **RED** — 실패하는 테스트 작성 (자동)
3. **GREEN** — 테스트 통과하는 최소 구현 (자동)
4. **REFACTOR** — 코드 정리 (자동)
5. **VERIFY** — 전체 게이트 검증 → 🛑 결과에 따라 사용자 판단
6. **SHIP** — 커밋 + PR → 🛑 사용자 승인

### 개별 스킬 (수동 실행)

각 단계를 별도 턴에서 독립적으로 실행할 수도 있다:

```
/spec "기능 설명" → .specs/<feature>/ 에 명세 생성
/red              → 실패하는 테스트 작성
/green            → 테스트 통과하는 최소 구현
/refactor         → 코드 정리 (테스트 유지)
/verify           → 전체 게이트 검증 리포트
/ship             → 커밋 + PR
```

### 원칙

- **단일 산출물**: 각 단계는 정확히 하나의 산출물만 생성한다
- **턴 분리**: 한 턴에 두 단계를 합치지 않는다 (Goal Fixation 방지)
- **결정적 검증**: tsc, biome, build 등 결정적 도구로 검증한다 (AI 자체 판단 아님)
- **위임**: How가 아닌 What/Why를 전달하고, 코드베이스를 분석하여 최선의 방법을 찾는다

## 참고사항

- PostEdit hooks가 매 편집 후 `check-types`와 `lint`를 자동 실행함
- `packages/shared`는 `src/` 디렉토리 없이 루트에 바로 위치
- `apps/shop/src/tests/`는 Playwright E2E (vitest 아님) — vitest config에서 제외됨
- 프로젝트 전체 요구사항은 `SPEC.md` 참조
