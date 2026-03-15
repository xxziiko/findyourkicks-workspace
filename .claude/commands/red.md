---
description: 실패하는 테스트를 작성합니다 (TDD Red 단계)
argument-hint: <테스트 대상 — spec 참조 또는 기능 설명>
---

이 턴의 산출물은 오직 **실패하는 테스트 파일**이다.
프로덕션 코드는 절대 건드리지 않는다.

## 입력

`$ARGUMENTS` — 테스트할 기능 설명. `.specs/<feature>/tasks.md`가 있으면 참조한다.

## 산출물

- 테스트 파일 (*.test.ts 또는 *.spec.ts)
- 실행 결과 (전부 FAIL이어야 정상)

## 프로세스

1. `$ARGUMENTS`에서 테스트 대상을 파악한다.
2. `.specs/<feature>/tasks.md`가 있으면 읽어서 테스트 범위를 결정한다.
3. 코드베이스를 탐색하여 대상 앱과 테스트 유형을 결정한다:
   - **Vitest 단위 테스트**: `features/<domain>/__tests__/<name>.test.ts` (소스 옆 co-locate)
   - **Playwright E2E (admin)**: `playwright/tests/admin/<name>.spec.ts` (Page Object Model 사용)
   - **Playwright E2E (shop)**: `apps/shop/src/tests/<name>.test.ts`
4. 테스트를 작성한다:
   - 테스트명은 한국어로 작성 (프로젝트 컨벤션)
   - 구조: Arrange → Act → Assert
   - 포함: happy path, edge case, error case
5. 테스트를 실행하여 FAIL을 확인한다:
   - Vitest: `pnpm --filter shop test -- --run <파일경로>`
   - Playwright admin: `pnpm test:admin -- --grep "<테스트명>"`
   - Playwright shop: `pnpm test:shop -- --grep "<테스트명>"`
6. 결과를 보고한다: 각 테스트의 FAIL 상태와 에러 메시지.

## 테스트 작성 규칙

- Vitest: `vitest`에서 import, `describe`/`it`/`expect` 사용
- Playwright: `@playwright/test`에서 import, `test.describe`/`test`/`expect` 사용
- Playwright admin 테스트는 기존 `AdminPage` 클래스를 확장하여 사용

## 규칙

- 프로덕션 코드를 작성하거나 수정하지 않는다 — 테스트 파일만.
- 테스트를 통과시키는 mock 구현을 만들지 않는다.
- 테스트가 통과하면 기존 동작을 테스트하는 것이므로 재검토한다.
- 기존 코드를 리팩토링하지 않는다.
