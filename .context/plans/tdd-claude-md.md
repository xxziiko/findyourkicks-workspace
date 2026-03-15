# TDD 스킬 파이프라인 + CLAUDE.md 설계

## Context

Teo의 "산출물이 행동을 만든다" 철학을 findyourkicks 프로젝트에 적용합니다. 현재 `.claude/commands/`에는 운영용 스킬(qa-browser, ship, ccg-mcp, teams-mcp)만 있고, TDD 워크플로우 스킬이 없습니다. CLAUDE.md도 없어서 Claude가 프로젝트 컨텍스트 없이 작업합니다.

**목표**: 단일 책임 + 단일 산출물 원칙의 TDD 스킬 5개와 프로젝트 컨텍스트 CLAUDE.md를 구축합니다.

---

## 생성할 파일 (6개)

### 1. `CLAUDE.md` (루트)

프로젝트 구조, 기술 스택, 코드 컨벤션, 테스트 전략, 검증 명령어를 담은 프로젝트 컨텍스트 파일. 핵심 내용:

- 모노레포 구조 (apps/shop, apps/admin, packages/shared)
- 기술 스택 (Next.js 15, React 19, Vite 6, Supabase, TanStack Query, Jotai)
- 코드 컨벤션 (Biome, 피처 슬라이스 구조, 컨벤셔널 커밋)
- API 패턴 (shop=fetch, admin=axios)
- 테스트 전략 (vitest 단위테스트, playwright E2E)
- 검증 명령어 (check-types, lint, build, test)

### 2. `.claude/commands/spec.md` — 산출물: 명세서

- 코드베이스를 분석해서 구조화된 스펙 문서를 대화에 출력
- 파일 생성/수정 금지, 코드 작성 금지
- 구조: Context → Requirements → Test Plan → Affected Files → Open Questions

### 3. `.claude/commands/red.md` — 산출물: 실패하는 테스트

- 테스트 파일만 생성 (프로덕션 코드 수정 금지)
- vitest: `__tests__/<name>.test.ts` (소스 옆 co-locate)
- playwright admin: `playwright/tests/admin/<name>.spec.ts`
- playwright shop: `apps/shop/src/tests/<name>.test.ts`
- 실행해서 FAIL 확인 필수

### 4. `.claude/commands/green.md` — 산출물: 테스트를 통과하는 최소 구현

- 실패 테스트를 통과시키는 최소한의 프로덕션 코드만 작성
- 테스트 파일 수정 금지, 리팩토링 금지, 추가 기능 금지
- 실행해서 PASS 확인 필수

### 5. `.claude/commands/refactor.md` — 산출물: 리팩토링된 코드

- 코드 품질 개선 (중복 제거, 네이밍, 구조 정리)
- 리팩토링 전후 테스트 실행, 둘 다 PASS여야 함
- 테스트 파일 수정 금지, 동작 변경 금지

### 6. `.claude/commands/verify.md` — 산출물: 검증 결과 리포트

- 게이트 순서: TypeScript → Biome Lint → Build → Unit Tests → E2E Tests
- 각 게이트 PASS/FAIL 테이블로 출력
- 코드 수정 절대 금지, 보고만

---

## 워크플로우

```
/spec "기능 설명" → 명세서 리뷰 → /red → FAIL 확인 → /green → PASS 확인 → /refactor → /verify
```

각 단계는 **별도 턴**으로 실행. 한 턴에 두 단계를 합치지 않음 (Goal Fixation 방지).

---

## 기존 인프라와의 관계

- **PostEdit hooks** (check-types, lint): 편집 중 즉시 피드백 → green/refactor 단계에서 자동 작동
- **/verify**: 전체 게이트 종합 리포트 → 빌드와 테스트까지 포함하므로 hooks와 중복 아님
- **/ship** (기존 스킬): verify 통과 후 커밋+PR 생성에 활용

---

## 검증 방법

1. 각 스킬 파일이 올바른 경로에 생성되었는지 확인
2. `/spec`, `/red`, `/green`, `/refactor`, `/verify`가 Claude Code에서 슬래시 명령으로 인식되는지 확인
3. 간단한 기능(예: 유틸 함수)으로 전체 파이프라인 `/spec → /red → /green → /refactor → /verify` 시험 실행
