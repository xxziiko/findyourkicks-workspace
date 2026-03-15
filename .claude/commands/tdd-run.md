---
description: SDD+TDD 파이프라인을 반자동으로 실행하는 executor
argument-hint: <기능 설명>
---

너는 SDD+TDD 파이프라인 executor다. `$ARGUMENTS`로 받은 기능을 아래 파이프라인으로 구현한다.
각 Phase를 순서대로 실행하되, 🛑 표시된 곳에서는 반드시 사용자 확인을 받는다.

## 파이프라인

### Phase 1: SPEC (사람 게이트)

1. 코드베이스를 분석하여 `$ARGUMENTS` 기능의 현재 상태를 파악한다.
2. `SPEC.md`를 참조하여 프로젝트 요구사항과의 정합성을 확인한다.
3. `.specs/<feature-name>/` 디렉토리에 3개 파일을 생성한다:
   - `requirements.md` — 요구사항 + 수용 기준 (Given/When/Then)
   - `design.md` — 영향받는 파일, 컴포넌트 관계, 데이터 흐름
   - `tasks.md` — 구현 단위 분해
4. 생성된 명세를 요약하여 사용자에게 보여준다.

🛑 **사용자에게 질문한다**: "명세를 검토해주세요. 진행할까요, 수정이 필요한가요?"
- 수정 요청 → 명세를 수정하고 다시 확인을 받는다.
- 승인 → Phase 2로 진행한다.

### Phase 2: RED (자동)

1. `tasks.md`의 태스크를 순서대로 읽는다.
2. 각 태스크에 대해 실패하는 테스트를 작성한다:
   - Vitest 단위: `features/<domain>/__tests__/<name>.test.ts`
   - Playwright E2E admin: `playwright/tests/admin/<name>.spec.ts`
   - Playwright E2E shop: `apps/shop/src/tests/<name>.test.ts`
3. 테스트를 실행하여 전부 FAIL인지 확인한다.
4. FAIL 결과를 보고하고 Phase 3로 자동 진행한다.

⚠️ 테스트가 PASS하면 — 이미 구현된 기능이므로 해당 태스크를 건너뛴다.

### Phase 3: GREEN (자동)

1. 실패하는 테스트 파일을 읽어 어설션을 파악한다.
2. 각 어설션을 충족하는 **최소한의 프로덕션 코드**를 작성한다.
3. 테스트를 실행하여 전부 PASS인지 확인한다.
4. PASS 결과를 보고하고 Phase 4로 자동 진행한다.

⚠️ PASS 실패 시 — 구현을 수정하고 다시 테스트한다. 3회 시도 후에도 실패하면 🛑 중단하고 사용자에게 보고한다.

### Phase 4: REFACTOR (자동)

1. Phase 3에서 작성한 코드를 검토한다.
2. 코드 품질을 개선한다 (중복 제거, 네이밍, 구조 정리).
3. 테스트를 실행하여 여전히 PASS인지 확인한다.
4. 리팩토링이 불필요하면 이 Phase를 건너뛴다.

⚠️ 리팩토링 후 테스트 실패 시 — 변경을 되돌리고 건너뛴다.

### Phase 5: VERIFY (사람 게이트)

아래 게이트를 순서대로 실행한다:

1. `pnpm run check-types 2>&1`
2. `pnpm run lint --quiet 2>&1`
3. `pnpm run build 2>&1`
4. 관련 테스트 실행 (vitest 또는 playwright)

결과를 PASS/FAIL 테이블로 보고한다.

🛑 **전부 PASS → 사용자에게 질문한다**: "모든 게이트를 통과했습니다. 커밋하고 PR을 만들까요?"
🛑 **FAIL 있음 → 사용자에게 보고한다**: 실패 항목과 에러 메시지를 보여주고, "수정을 시도할까요, 아니면 여기서 멈출까요?"라고 질문한다.

### Phase 6: SHIP (사용자 승인 후)

사용자가 승인하면:
1. 변경된 파일을 staging한다.
2. 컨벤셔널 커밋 메시지로 커밋한다.
3. PR을 생성한다.

## 진행 상황 보고

각 Phase 시작 시 현재 위치를 표시한다:

```
📋 Phase 1/6: SPEC ← 현재
⬜ Phase 2/6: RED
⬜ Phase 3/6: GREEN
⬜ Phase 4/6: REFACTOR
⬜ Phase 5/6: VERIFY
⬜ Phase 6/6: SHIP
```

Phase 완료 시:

```
✅ Phase 1/6: SPEC — 완료 (requirements 4개, tasks 3개)
🔴 Phase 2/6: RED ← 현재
⬜ Phase 3/6: GREEN
⬜ Phase 4/6: REFACTOR
⬜ Phase 5/6: VERIFY
⬜ Phase 6/6: SHIP
```

## 규칙

- 각 Phase의 산출물 범위를 엄격히 지킨다:
  - SPEC: `.specs/` 파일만
  - RED: 테스트 파일만
  - GREEN: 프로덕션 코드만 (테스트 수정 금지)
  - REFACTOR: 프로덕션 코드만 (동작 변경 금지)
  - VERIFY: 파일 수정 없음
- 🛑 게이트에서는 반드시 사용자 응답을 기다린다. 스스로 판단하지 않는다.
- VERIFY 실패 시 자동 수정하지 않는다 — 사용자가 수정을 요청할 때만 시도한다.
- 3회 연속 실패 시 해당 Phase를 중단하고 사용자에게 보고한다.
