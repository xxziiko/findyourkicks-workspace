# FindYourKicks 프로젝트 고도화 전략

## Context

FindYourKicks는 신발 쇼핑 e-commerce 플랫폼으로, Next.js 15 (shop) + React/Vite (admin) 모노레포 구조로 운영 중이다.
현재 Feature-Sliced Design 아키텍처를 따르고 있어 이미 DDD의 Bounded Context와 유사한 구조를 갖추고 있다.
프로덕션 배포 중이며, 결제(Toss Payments)·주문·장바구니·인증 등 핵심 플로우가 구현되어 있다.

---

## 프로젝트 현황 진단

### 강점
- Feature-Sliced Design으로 도메인 경계가 명확
- TanStack Query v5 + Jotai 조합의 서버/클라이언트 상태 분리
- Zod 스키마 기반 타입 안전성
- 쿼리 키 팩토리 패턴, Optimistic Update 등 모범 패턴 적용

### 주요 이슈

| 우선순위 | 이슈 | 영향 |
|---------|------|------|
| 🔴 높음 | API 라우트에 console.log/error 다수 노출 | 보안·프로덕션 품질 |
| 🔴 높음 | 결제·주문 플로우 테스트 전무 | 서비스 안정성 |
| 🔴 높음 | 에러 객체 stringify 버그 (`${error}` → "[object Object]") | 디버깅 불가 |
| 🟡 중간 | `window.daum` 미타입·무결성 체크 없는 동적 스크립트 | 런타임 오류 위험 |
| 🟡 중간 | TODO/FIXME 미해결 (`ProductSectionList`, `useProductOption`) | 기술 부채 |
| 🟡 중간 | 장바구니 카운트/목록 쿼리 미일치 가능성 | UX 불일치 |
| 🟢 낮음 | useCallback/useMemo 미흡 | 성능 |
| 🟢 낮음 | Admin 뮤테이션 onError 핸들링 부재 | 관리 UX |

### DDD 관점 분석
현재 코드는 이미 5개 Bounded Context로 분리되어 있다:
- **Product Catalog**: 상품·재고 조회
- **Shopping Cart**: 장바구니 CRUD
- **Order Management**: 주문 시트·주문 이력
- **Payment**: Toss 결제 흐름
- **User Profile**: 인증·배송지

구조적 DDD 재설계보다 **현재 Context 내부의 코드 품질 강화**가 더 효과적이다.

---

## 권장 전략: "안정화 → 기능 고도화" 순차 진행

### 이유
DDD 재설계를 먼저 하면:
- 기존 구조가 이미 양호하므로 투자 대비 효과가 낮음
- 불안정한 기반 위에 새 기능을 올리면 리팩토링 비용이 배로 늘어남

코드 레벨 안정화를 먼저 하면:
- 버그를 제거한 뒤 기능을 추가하므로 회귀 위험 최소화
- 테스트 기반을 갖춘 뒤 기능 추가 → 안전한 고도화 가능

---

## Phase 1: 안정화 (Stabilize) — 약 1주

### 1-1. 크리티컬 버그 수정
- **에러 핸들링**: `${error}` → `error.message ?? JSON.stringify(error)` 전체 교체
- **console 제거**: API 라우트 전체에서 console.log/error 제거 또는 로거 유틸리티 도입
- **장바구니 쿼리 일관성**: count 쿼리와 list 쿼리 invalidation 동기화

### 1-2. 타입 안전성 강화
- `window.daum` 전역 타입 선언 (`daum-postcode.d.ts`)
- 동적 외부 스크립트 로드 에러 핸들링 추가

### 1-3. TODO/FIXME 해소
- `ProductSectionList.tsx`: "TODO: 직접 구현" 구현 또는 제거
- `useProductOption.ts`: `findIndex → find` 리네이밍

### 1-4. 테스트 기반 구축 (가장 중요)
- **결제·주문 핵심 플로우 E2E 테스트** (Playwright): Cart → OrderSheet → Payment → Order
- **장바구니 mutation 단위 테스트**: 추가·수량 변경·삭제·합산 로직
- **주소 폼 검증 테스트**: Zod 스키마 경계 케이스

---

## Phase 2: 기능 고도화 (Advance)

Phase 1 완료 후, 아래 기능들 중 우선순위를 정해 진행:

### 2-A. 사용자 경험 개선
- 상품 검색 기능 (현재 없음)
- 상품 필터링 (브랜드·카테고리·사이즈·가격대)
- 위시리스트 기능
- 주문 취소·교환·반품 플로우

### 2-B. 도메인 강화
- 재입고 알림 (품절 상품 알림 신청)
- 상품 리뷰·평점 시스템
- 쿠폰·프로모션 코드 적용

### 2-C. 관리자 고도화
- 대시보드 매출 통계·시각화 (현재 기본 수준)
- 재고 일괄 관리
- 주문 상태 일괄 처리

### 2-D. 성능·인프라
- 상품 목록 이미지 Next.js Image 최적화
- Admin app Optimistic Update 패턴 일관화
- 에러 모니터링 도입 (Sentry 등)

---

## 핵심 파일 경로 (Phase 1 수정 대상)

```
apps/shop/src/app/api/order-sheets/route.ts    # console 제거, 에러 처리
apps/shop/src/app/api/products/route.ts         # console 제거
apps/shop/src/app/api/orders/route.ts           # 에러 stringify 버그
apps/shop/src/app/api/users/addresses/route.ts  # console 제거
apps/shop/src/features/cart/hooks/useCart.ts    # 쿼리 일관성
apps/shop/src/shared/hooks/useSearchAddress.ts  # window.daum 타입 및 에러 처리
apps/shop/src/features/product/components/ProductSectionList.tsx  # TODO 해소
apps/shop/src/features/product/hooks/useProductOption.ts          # FIXME 해소
apps/shop/src/tests/                            # E2E 테스트 추가
```

---

## omc-teams 실행 계획 (tri-model)

| 모델 | 역할 |
|------|------|
| **Codex** | 기계적 코드 정리 — console 제거, 리네이밍, 반복 패턴 수정 |
| **Claude** | 복잡한 로직 수정 — 에러 처리 버그, 쿼리 일관성, 동적 스크립트 에러 핸들링 |
| **Gemini** | 코드 리뷰·패턴 분석 — 타입 선언, 추가 이슈 탐지, Round 1 변경사항 검토 |

---

### Round 1: 코드 수정 (3 workers 병렬)

**Worker 1 — Codex: 기계적 정리**
- `app/api/order-sheets/route.ts`: console.log/error 전부 제거
- `app/api/products/route.ts`: console.error 제거
- `app/api/orders/route.ts`: console 제거
- `app/api/users/addresses/route.ts`: console 제거
- `features/product/hooks/useProductOption.ts`: `findIndex` → `find` 리네이밍

**Worker 2 — Claude: 로직 수정**
- `app/api/orders/route.ts`: `` `${error}` `` → `error instanceof Error ? error.message : JSON.stringify(error)` 패턴 전체 적용
- `features/cart/hooks/useCart.ts`: count/list 쿼리 invalidation 동기화 수정
- `shared/hooks/useSearchAddress.ts`: 스크립트 로드 실패 에러 핸들링 추가
- `features/product/components/ProductSectionList.tsx`: TODO 구현 또는 제거

**Worker 3 — Gemini: 타입 분석 및 이슈 탐지**
- `types/daum-postcode.d.ts` 생성: `window.daum.Postcode` 전역 타입 선언
- 전체 API 라우트 스캔하여 추가 에러 처리 누락 지점 보고
- Admin 뮤테이션 onError 누락 패턴 목록화

---

### Round 2: 테스트 + 리뷰 (3 workers 병렬)

**Worker 1 — Claude: E2E 테스트**
- `tests/cart-to-order.test.ts`: 장바구니 추가 → 주문시트 생성 → 결제 준비 플로우

**Worker 2 — Codex: 단위 테스트**
- `features/cart/hooks/useCart.test.ts`: 합산·선택·가격 계산 로직
- `features/user/address/`: Zod 스키마 경계 케이스 (빈 문자열, 최대 길이)

**Worker 3 — Gemini: Round 1 코드 리뷰**
- Round 1에서 수정된 파일 전체 리뷰
- 누락된 에러 처리·타입 오류 잔존 여부 확인 및 보고

---

## 검증 방법

1. `pnpm turbo run lint` — Biome 린트 통과 확인
2. `pnpm turbo run build` — 빌드 오류 없음 확인
3. Playwright E2E: 결제 전 플로우 (카트→주문시트→결제 준비) 통과
4. 콘솔 로그 없음 확인: 프로덕션 빌드에서 console 출력 부재
5. 에러 시나리오: 잘못된 API 호출 시 명확한 에러 메시지 반환 확인
