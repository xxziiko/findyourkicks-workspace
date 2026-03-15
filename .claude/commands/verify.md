---
description: 모든 검증 게이트를 실행하고 PASS/FAIL 리포트를 생성합니다
argument-hint: [shop | admin | all]
---

이 턴의 산출물은 **검증 결과 리포트**다.
코드 수정은 하지 않는다. 문제가 있으면 보고만 한다.

## 입력

`$ARGUMENTS` — 범위 지정: `shop`, `admin`, 또는 `all` (기본값: `all`).

## 산출물

아래 형식의 검증 리포트:

```
### 검증 리포트

| 게이트 | 상태 | 상세 |
|--------|------|------|
| TypeScript | PASS/FAIL | 에러 수 또는 "clean" |
| Biome Lint | PASS/FAIL | 에러 수 또는 "clean" |
| Build | PASS/FAIL | 에러 요약 또는 "clean" |
| Unit Tests (shop) | PASS/FAIL/SKIP | pass/fail/skip 수 |
| E2E Tests (admin) | PASS/FAIL/SKIP | pass/fail/skip 수 |
| E2E Tests (shop) | PASS/FAIL/SKIP | pass/fail/skip 수 |

**종합: PASS / FAIL**

[FAIL 항목이 있으면: 파일 경로와 에러 메시지 나열]
```

## 실행 순서

1. **TypeScript**: `pnpm run check-types 2>&1`
2. **Biome Lint**: `pnpm run lint --quiet 2>&1`
3. **Build**:
   - scope=shop: `pnpm run build:shop 2>&1`
   - scope=admin: `pnpm run build:admin 2>&1`
   - scope=all: `pnpm run build 2>&1`
4. **Unit Tests** (admin이면 SKIP): `pnpm --filter shop test -- --run 2>&1`
5. **E2E Admin** (shop이면 SKIP): `pnpm test:admin 2>&1`
6. **E2E Shop** (admin이면 SKIP): `pnpm test:shop 2>&1`

범위 밖 게이트는 SKIP으로 표시한다.

## 규칙

- 어떤 파일도 수정하지 않는다.
- 실패를 수정하려고 시도하지 않는다.
- 범위 내 모든 게이트를 실행한다 — 앞선 게이트가 실패해도 나머지를 건너뛰지 않는다.
- 실패 항목의 에러 메시지를 원문 그대로 보고한다 — 요약하거나 해석하지 않는다.
- 명령어가 타임아웃되면 FAIL + "timeout"으로 보고한다.
