---
description: 실패하는 테스트를 통과시키는 최소 구현을 작성합니다 (TDD Green 단계)
argument-hint: <실패하는 테스트 파일 경로 또는 설명>
---

이 턴의 산출물은 **테스트를 통과시키는 최소한의 프로덕션 코드**다.
테스트 파일은 절대 건드리지 않는다.

## 입력

`$ARGUMENTS` — 실패하는 테스트 파일 경로 또는 설명.

## 산출물

- 프로덕션 코드 변경 (최소한만)
- 실행 결과 (전부 PASS여야 정상)

## 프로세스

1. `$ARGUMENTS`에서 실패하는 테스트 파일을 식별한다.
2. 테스트를 실행하여 현재 FAIL 상태를 확인한다:
   - Vitest: `pnpm --filter shop test -- --run <파일경로>`
   - Playwright admin: `pnpm test:admin -- --grep "<테스트명>"`
   - Playwright shop: `pnpm test:shop -- --grep "<테스트명>"`
3. 테스트 어설션을 읽어 코드가 무엇을 해야 하는지 파악한다.
4. 각 어설션을 충족하는 **최소한의 구현**을 작성한다.
5. 테스트를 다시 실행하여 PASS를 확인한다.
6. 결과를 보고한다: 각 테스트의 PASS/FAIL 상태.

## 규칙

- 테스트를 통과시키는 데 필요한 코드만 작성한다 — 추가 기능 없음.
- 테스트 파일을 수정하지 않는다.
- 리팩토링하거나 최적화하지 않는다 — 그건 `/refactor` 단계다.
- 테스트 어설션에 없는 기능을 추가하지 않는다.
- 추가 테스트를 작성하지 않는다.
- 프로젝트 패턴을 따른다:
  - 피처 구조: `features/<domain>/{apis.ts, components/, hooks/, types.ts}`
  - Shop API: fetch 래퍼 함수
  - Admin API: axios 인스턴스
  - 상태: TanStack Query hooks (서버), Jotai atoms (클라이언트)
  - 폼: React Hook Form + Zod 스키마
- 첫 실행에서 모든 테스트가 이미 통과하면, 보고 후 중단한다 — 구현할 것이 없다.
