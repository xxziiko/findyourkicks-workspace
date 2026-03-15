# SDD + TDD 통합 스킬 파이프라인

## Context

Teo의 "산출물이 행동을 만든다" 철학 + Claude Code의 **Spec-Driven Development(SDD)** 패턴을 findyourkicks에 통합 적용합니다.

- SDD: 코딩 전 명세화 (Requirements → Design → Tasks) — **무엇을, 왜** 만드는지 정의
- TDD: 구현 품질 (Red → Green → Refactor) — **어떻게** 만드는지를 테스트가 주도
- 두 방법론은 보완적: SDD가 방향을, TDD가 품질을 보장

현재 상태: `.claude/commands/`에 운영 스킬 4개만 존재, CLAUDE.md 없음, specs 디렉토리 없음.

---

## 생성할 파일 (7개)

### 1. `SPEC.md` (루트) — 프로젝트 전체 요구사항

Claude Code가 프로젝트의 비즈니스 도메인과 요구사항을 이해하는 고수준 명세서:

- **프로젝트 비전**: 스니커즈 이커머스 플랫폼 (Shop + Admin)
- **도메인별 요구사항** (수용 기준 포함):
  - 상품 관리 (등록, 수정, 검색/필터, 재고)
  - 주문 (주문서 → 주문 확정, 상태 관리)
  - 결제 (결제 처리, 주문서 연동)
  - 장바구니 (추가/수정/삭제, 수량 관리)
  - 반품/취소/교환 (요청 → 승인 → 재고 복원)
  - 리뷰 (작성, 이미지 업로드, 평점)
  - 인증 (OAuth via Supabase, 역할 기반 접근)
  - 사용자 (프로필, 배송지 관리)
- **비기능 요구사항**: 성능, 접근성, 모바일 반응형
- 코드베이스의 현재 구현 상태를 분석하여 작성

### 2. `CLAUDE.md` (루트) — 프로젝트 컨텍스트

Claude가 모든 대화에서 자동 로드하는 프로젝트 지식. 핵심 내용:

- 모노레포 구조 (apps/shop, apps/admin, packages/shared)
- 기술 스택 (Next.js 15, React 19, Vite 6, Supabase, TanStack Query, Jotai)
- 코드 컨벤션 (Biome, 피처 슬라이스 구조, 컨벤셔널 커밋)
- API 패턴 (shop=fetch wrapper, admin=axios+supabase interceptor)
- 테스트 전략 (vitest 단위, playwright E2E)
- 검증 명령어 (check-types, lint, build, test)
- **SDD+TDD 워크플로우 안내** (`/spec → /red → /green → /refactor → /verify`)

### 3. `.claude/commands/spec.md` — 산출물: 스펙 파일

SDD 핵심 단계. cc-sdd/Pimzino 패턴을 참고하되 프로젝트에 맞게 경량화:

- 코드베이스 분석 후 **`.specs/<feature-name>/` 디렉토리에 구조화된 스펙 파일 생성**
- 산출물 구조:
  - `requirements.md` — 요구사항 + 수용 기준 (Given/When/Then)
  - `design.md` — 영향받는 파일, 컴포넌트 관계, 데이터 흐름
  - `tasks.md` — 구현 단위 분해 (TDD /red 단계의 입력이 됨)
- 프로덕션 코드 수정 금지
- 모호한 점은 Open Questions로 사용자에게 질문

### 4. `.claude/commands/red.md` — 산출물: 실패하는 테스트

- 테스트 파일만 생성 (프로덕션 코드 수정 금지)
- **입력**: `/spec`에서 생성된 tasks.md 또는 사용자 설명
- vitest: `__tests__/<name>.test.ts` (소스 옆 co-locate)
- playwright admin: `playwright/tests/admin/<name>.spec.ts`
- playwright shop: `apps/shop/src/tests/<name>.test.ts`
- 실행해서 FAIL 확인 필수

### 5. `.claude/commands/green.md` — 산출물: 테스트를 통과하는 최소 구현

- 실패 테스트를 통과시키는 최소한의 프로덕션 코드만 작성
- 테스트 파일 수정 금지, 리팩토링 금지, 추가 기능 금지
- 실행해서 PASS 확인 필수

### 6. `.claude/commands/refactor.md` — 산출물: 리팩토링된 코드

- 코드 품질 개선 (중복 제거, 네이밍, 구조 정리)
- 리팩토링 전후 테스트 실행, 둘 다 PASS여야 함
- 테스트 파일 수정 금지, 동작 변경 금지

### 7. `.claude/commands/verify.md` — 산출물: 검증 결과 리포트

- 게이트 순서: TypeScript → Biome Lint → Build → Unit Tests → E2E Tests
- 각 게이트 PASS/FAIL 테이블로 출력
- 코드 수정 절대 금지, 보고만

### 8. `.specs/` 디렉토리 구조 (초기 설정)

```
.specs/
└── .gitkeep
```

스펙 파일이 `/spec` 실행 시 여기에 생성됨:
```
.specs/
└── <feature-name>/
    ├── requirements.md   # 요구사항 + 수용 기준
    ├── design.md         # 설계 + 영향 분석
    └── tasks.md          # 구현 단위 (→ /red 입력)
```

---

## 통합 워크플로우

```
/spec "위시리스트 기능"
  ↓ .specs/wishlist/{requirements,design,tasks}.md 생성
  ↓ 사용자 리뷰 & 승인
/red "wishlist"
  ↓ tasks.md 기반 실패 테스트 작성, FAIL 확인
/green
  ↓ 최소 구현, PASS 확인
/refactor
  ↓ 코드 정리, PASS 유지 확인
/verify
  ↓ 전체 게이트 리포트
/ship (기존 스킬)
  ↓ 커밋 + PR
```

각 단계는 **별도 턴**으로 실행 (Goal Fixation 방지).

---

## 기존 인프라와의 관계

| 기존 | 역할 | 통합 |
|------|------|------|
| PostEdit hooks (check-types, lint) | 편집 중 즉시 피드백 | green/refactor에서 자동 작동 |
| /verify | 종합 게이트 리포트 | 빌드+테스트 포함, hooks와 보완적 |
| /ship | 커밋+PR | verify 통과 후 실행 |
| /qa-browser | 브라우저 QA | verify 후 선택적 실행 |

---

## 구현 순서

1. `.specs/` 디렉토리 + `.gitkeep` 생성
2. `SPEC.md` 작성 (프로젝트 전체 요구사항 — 코드베이스 분석 기반)
3. `CLAUDE.md` 작성 (프로젝트 컨텍스트)
4. `.claude/commands/spec.md` 작성
5. `.claude/commands/red.md` 작성
6. `.claude/commands/green.md` 작성
7. `.claude/commands/refactor.md` 작성
8. `.claude/commands/verify.md` 작성
9. `.claude/commands/README.md` 작성 (워크플로우 + 각 명령어 설명 + 사용 예시)

---

## 검증 방법

1. 각 파일이 올바른 경로에 생성되었는지 확인
2. `/spec`, `/red`, `/green`, `/refactor`, `/verify`가 슬래시 명령으로 인식되는지 확인
3. `.specs/` 디렉토리가 생성되었는지 확인
4. (선택) 간단한 유틸 함수로 전체 파이프라인 시험 실행
