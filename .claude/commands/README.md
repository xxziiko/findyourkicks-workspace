# SDD + TDD 스킬 가이드

## 워크플로우

각 단계는 **별도 턴**에서 실행합니다. 한 턴에 두 단계를 합치지 마세요.

```
/spec "기능 설명"   → 명세 파일 생성 (.specs/<feature>/)
        ↓ 리뷰 & 승인
/red "feature"      → 실패하는 테스트 작성
        ↓ FAIL 확인
/green              → 테스트 통과하는 최소 구현
        ↓ PASS 확인
/refactor           → 코드 품질 개선 (테스트 유지)
        ↓ PASS 유지 확인
/verify             → 전체 게이트 검증 리포트
        ↓ 종합 PASS 확인
/ship               → 커밋 + PR 생성
```

### 자동 실행 (반자동 executor)

전체 파이프라인을 한 명령으로 실행하되, 핵심 지점에서 사용자 확인을 받습니다:

```
/tdd-run "기능 설명"
```

자동 구간: RED → GREEN → REFACTOR (테스트가 결정적 게이트 역할)
사람 게이트: SPEC 승인, VERIFY 실패 시 판단, SHIP 결정

## 명령어 요약

| 명령어 | 산출물 | 수정 범위 |
|--------|--------|-----------|
| `/spec <설명>` | `.specs/<feature>/` 에 requirements.md, design.md, tasks.md | .specs/ 만 |
| `/red <대상>` | 실패하는 테스트 파일 (*.test.ts / *.spec.ts) | 테스트만 |
| `/green <테스트>` | 테스트 통과하는 최소 프로덕션 코드 | 프로덕션만 |
| `/refactor <대상>` | 리팩토링된 코드 (테스트 유지) | 프로덕션만 |
| `/verify [범위]` | PASS/FAIL 검증 리포트 | 수정 없음 |
| `/tdd-run <설명>` | 전체 파이프라인 반자동 실행 | 위 전체 (사람 게이트 포함) |

## 핵심 원칙

1. **단일 산출물**: 각 스킬은 정확히 하나의 산출물만 생성합니다
2. **턴 분리**: 한 턴에 두 단계를 합치면 Goal Fixation이 발생합니다
3. **결정적 검증**: `/verify`는 tsc, biome, build 등 결정적 도구로 검증합니다 (AI 자체 판단 아님)
4. **위임**: How가 아닌 What/Why만 전달하고, Claude가 코드베이스를 분석하여 최선의 방법을 찾게 합니다

## 사용 예시

### 새 기능 개발

```
# 1단계: 명세 작성
/spec "위시리스트 기능 — 사용자가 상품을 찜할 수 있다"

# 2단계: 명세 리뷰 후, 실패하는 테스트 작성
/red "wishlist — tasks.md 기반으로 테스트 작성"

# 3단계: 최소 구현
/green "apps/shop/src/features/wishlist/__tests__/useWishlist.test.ts"

# 4단계: 코드 정리
/refactor "apps/shop/src/features/wishlist/"

# 5단계: 전체 검증
/verify shop
```

### 버그 수정

```
# 장바구니 수량 변경 시 재고 초과 검증이 없는 버그
/spec "장바구니 수량 변경 시 재고 초과 검증 추가"
/red "cart quantity validation"
/green
/verify shop
```

### 검증만 실행

```
/verify all     # 전체 프로젝트
/verify shop    # Shop 앱만
/verify admin   # Admin 앱만
```

## 기존 스킬과의 관계

| 스킬 | 용도 | TDD 파이프라인에서의 위치 |
|------|------|--------------------------|
| `/qa-browser` | 브라우저 QA 테스트 | `/verify` 후 선택적 실행 |
| `/ship` | 커밋 + PR | `/verify` PASS 후 실행 |
| `/ccg-mcp` | 멀티모델 분석 | `/spec` 전 탐색 단계에서 활용 |

## 디렉토리 구조

```
.specs/                    # /spec이 생성하는 명세 파일
└── <feature-name>/
    ├── requirements.md    # 요구사항 + 수용 기준
    ├── design.md          # 설계 + 영향 분석
    └── tasks.md           # 구현 태스크 (→ /red 입력)

.claude/commands/          # 스킬 정의
├── spec.md               # SDD 명세 생성
├── red.md                # TDD Red — 실패 테스트
├── green.md              # TDD Green — 최소 구현
├── refactor.md           # TDD Refactor — 코드 정리
├── verify.md             # 검증 게이트 리포트
├── tdd-run.md            # 반자동 executor (전체 파이프라인)
├── qa-browser.md         # 브라우저 QA (기존)
├── ship.md               # 커밋+PR (기존)
├── ccg-mcp.md            # 멀티모델 (기존)
├── teams-mcp.md          # 병렬 워커 (기존)
└── README.md             # ← 이 파일
```
