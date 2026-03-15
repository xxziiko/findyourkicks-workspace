<div align="center">
<img width="474" alt="Image" src="https://github.com/user-attachments/assets/97ad32e6-adb1-41d5-9b19-818e0641a7e6" />
</div>

<br/>
<br/>

> 신발 커머스 서비스 `findyourkicks`와 관리자 페이지를 함께 관리하는 레포지토리입니다. <br/>
> 사용자 앱(Shop)은 `Next.js App Router` 기반으로 제작되었고, 관리자(Admin) 앱은 `React + Vite`로 개발 중입니다.  
> 인증부터 DB 설계, API 연동까지 `Supabase`를 기반으로 전체 흐름을 구성했습니다.

<br/>
<br/>

### 🗂️ 레포 구성
- 사용자 서비스: `apps/shop` (Next.js + App Router)
- 관리자 서비스: `apps/admin` (React + Vite)
- 공통 패키지: `packages/shared` (UI, 유틸, 스타일 등)

### 기술 스택
- **Frontend**: `TypeScript`, `SCSS`
- **State Management**: `Tanstack Query`, `Jotai`
- **Backend**: `Supabase (Auth, DB, Storage, RPC)`
- **Testing**: `Playwright (E2E)`, `Vitest (Unit)`
- **CI/CD**: `GitHub Actions`, `Docker`, `Nginx`
- **Monorepo**: `pnpm`, `Turborepo`
- **Deployment**: `Vercel`, `Docker Compose`
- **DX**: `Husky (pre-commit, pre-push)`, `Biome (lint/format)`
- **AI**: `Claude Code` (SDD+TDD 자동화 파이프라인)


<br/>
<br/>

## findyourkicks (`apps/shop`)

>신발 커머스의 실제 사용자 흐름을 구현한 토이 프로젝트입니다. <br/>
>Next.js App Router와 Supabase를 활용하여 **상품 탐색부터 주문, 리뷰까지**의 전체 구매 흐름을 클라이언트 중심으로 설계했습니다. <br/>
>기존 서비스 개발 히스토리는 [findyourkicks 저장소](https://github.com/xxziiko/findyourkicks)에서 확인하실 수 있습니다.


<br/>

### 인프라
<img width="973" height="517" alt="image" src="https://github.com/user-attachments/assets/7f8b5905-8773-4a60-b8fd-531f2e005c2a" />




<br/>

#### 보러가기
🔗 https://findyourkicks.shop

#### 작업기간
2025.02 ~

<br/>

## 주요 기능
- 상품 목록/상세 페이지
- **상품 검색/필터** (브랜드, 카테고리, 사이즈, 가격대, 정렬)
- 장바구니 담기 / 주문하기
- 배송지 입력 및 관리
- 주문 내역 조회 / 상세 페이지
- **주문 취소/반품 요청**
- **상품 리뷰** (별점, 이미지 업로드, 작성/수정/삭제)


<br/>

## 폴더구조

```
📦src
 ┣ 📂app
 ┃ ┣ 📂(auth)
 ┃ ┣ 📂(order-flow)
 ┃ ┣ 📂(shop)
 ┃ ┃ ┗ 📂products          ← 검색/필터 페이지
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂cart
 ┃ ┃ ┣ 📂order-sheets
 ┃ ┃ ┣ 📂orders
 ┃ ┃ ┣ 📂payments
 ┃ ┃ ┣ 📂products
 ┃ ┃ ┣ 📂reviews            ← 리뷰 API
 ┃ ┃ ┗ 📂users
 ┣ 📂features
 ┃ ┣ 📂auth
 ┃ ┣ 📂cart
 ┃ ┣ 📂order
 ┃ ┣ 📂order-sheet
 ┃ ┣ 📂payment
 ┃ ┣ 📂product
 ┃ ┣ 📂review               ← 리뷰 도메인
 ┃ ┗ 📂user
 ┃ ┃ ┣ 📂address
 ┗ 📂shared
 ┃ ┣ 📂components
 ┃ ┣ 📂constants
 ┃ ┣ 📂hooks
 ┃ ┣ 📂styles
 ┃ ┗ 📂utils
```

<br/>

## 페이지

|메인 페이지|상세 페이지|
|----|----|
|<img width="500px" alt="Image" src="https://github.com/user-attachments/assets/36ed32a0-a88a-480e-8af5-770004186197" />|<img width="500px" alt="Image" src="https://github.com/user-attachments/assets/460ae79e-da93-4ce5-a40c-838b8112e6fd" />|

|로그인 페이지|장바구니 페이지|
|----|----|
|<img width="500px" alt="Image" src="https://github.com/user-attachments/assets/665dd1f1-20bd-4e31-ac0f-dea4bba582aa" />|<img width="500px" alt="Image" src="https://github.com/user-attachments/assets/a541d0bc-8414-48ae-8640-61387d26434c" />|

|주문 페이지|결제 페이지|
|----|----|
| <img width="500px" alt="Image" src="https://github.com/user-attachments/assets/0b99240f-9744-429d-b419-b52b7e61247b" />|<img width="500px" alt="Image" src="https://github.com/user-attachments/assets/04a8cbb7-ebf4-4d5a-8a34-1b0703d92080" />

|결제완료 페이지|주문 내역|
|---|---|
|<img width="500px" alt="Image" src="https://github.com/user-attachments/assets/621301e5-5d9b-451e-986e-c1bfeb0f11fa" />|<img width="500px" alt="Image" src="https://github.com/user-attachments/assets/9806f841-430f-4877-ab72-dcfc4deca2d7" />|

<br/>

## findyourkicks-admin (`apps/admin`)

> 관리자 서비스는 상품 등록과 주문 관리를 위한 백오피스이며, React + Vite 기반으로 구축했습니다. <br/>
> 사용자 서비스와 도메인을 공유하며 상품 운영 및 이미지 업로드 등 실제 운영 흐름을 반영한 기능을 구현했습니다.

#### 보러가기
🔗 https://findyourkicks-admin.site/

### 작업기간
2025.05 ~  


<br/>

## 주요 기능
- 상품 등록/관리
- **상품 검색** (제목, 상태, 카테고리, 브랜드, 등록일 기간)
- 주문 관리
- **반품/교환 관리** (승인/거절 처리)

<br/>

## 폴더구조

```
📦src
 ┣ 📂features
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┣ 📂hooks
 ┃ ┣ 📂dashboard
 ┃ ┃ ┣ 📂components
 ┃ ┣ 📂order
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┣ 📂hooks
 ┃ ┣ 📂product
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┣ 📂mutations
 ┃ ┃ ┃ ┣ 📂queries
 ┃ ┗ 📂returns              ← 반품/교환 관리
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┣ 📂hooks
 ┣ 📂pages
 ┣ 📂shared
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂layouts
 ┃ ┣ 📂constants
 ┃ ┣ 📂hooks
 ┃ ┣ 📂utils
```

<br/>

## 페이지

|로그인 페이지|대시보드|
|----|----|
|<img width="500" alt="Image" src="https://github.com/user-attachments/assets/628ca0e6-cca3-4d56-acfb-52385dee1355" />|<img width="500px" alt="Image" src="https://github.com/user-attachments/assets/f26f32bd-4800-4dab-a5a5-1e0a9bd3cde5" />|

|상품등록 페이지|
|--|
|<img width="500" alt="Image" src="https://github.com/user-attachments/assets/47be4483-386f-4aca-9ec9-3878aa867cab" />|

|이미지 업로드|이미지 캐러셀|
|---|---|
|<img width="500" alt="Image" src="https://github.com/user-attachments/assets/6f0d8eff-33ca-49c4-8dc9-50fc61eff083" />|<img width="500" alt="Image" src="https://github.com/user-attachments/assets/3bcf7d3f-2c01-4c97-afd0-fa94ceeae664" />|


<br/>

## 구현 및 학습 포인트

#### 1. 아키텍처 설계
- **Feature-Sliced 구조**를 기반으로 도메인 단위로 책임을 분리했습니다.
- `features/`, `shared/`, `app/` 3계층으로 디렉토리를 구조화했습니다.

#### 2. 상태관리
- 초기에는 Tanstack Query의 쿼리 키 팩토리 패턴 중복을 줄이기 위해 `createQueries` 커스텀 함수를 구현했으나, **네이티브 TanStack Query API(`queryOptions`)로 리팩토링**했습니다. <br/>
  커스텀 추상화 대신 공식 API를 활용하여 라이브러리 업데이트에 대한 호환성을 확보하고, 러닝 커브를 줄여 코드의 유지보수성을 개선했습니다.

- 로그인 인증과 같은 전역 상태를 **Jotai의 atom을 사용하여 Custom Hook으로 추상화**해 상태의 일관성과 코드 재사용성을 높였습니다.

#### 3. 데이터 흐름 및 렌더링
- API 호출 시 반복적인 헤더 설정과 오류 처리의 중복을 줄이기 위해 **공통 API 유틸을 설계**했습니다. <br />
  각 HTTP 메서드(GET, POST, PATCH, DELETE)에 대해 전용 팩토리 함수를 구성하여 호출 시점에 필요한 메서드만 명확하게 사용할 수 있도록 분리했습니다. <br />
  또한, 모든 요청에 credentials, Content-Type, 공통 headers를 포함시켜 일관된 호출 환경을 유지하고 제네릭 기반의 응답 타입 명시와 ApiError 타입화, assert 검증 유틸을 사용해 런타임 오류 방지와 UX 안정성을 강화했습니다.
예:`api.get<ProductList>(‘/products’)`

- **페이지의 특성**과 **사용자 인터랙션 유무**에 따라 **SSR과 CSR 전략을 적용**했습니다. <br/>
  정적 페이지는 **RSC와 fetch를 활용한 SSR 렌더링**으로 초기 로딩 속도를 개선했고, 사용자 상호작용이 필요한 컴포넌트는 **Tanstack Query의 prefetchQuery를 적용**해 CSR에서도 상태의 일관성을 유지했습니다.
  
- 장바구니 수량 변경 기능에서 네트워크 지연으로 인한 UI 응답 불일치 문제가 있었습니다. <br/>
  이를 해결하기 위해 **낙관적 업데이트(Optimistic UI)를 적용**하고 Tanstack Query의 onMutate, onError, onSettled 핸들러를 활용해 캐시 롤백 처리와 서버상태 동기화(invalidateQueries)를 구현했습니다.
  그 결과로 즉각적인 UI 반영과 함께 안정적인 사용자 경험을 제공했습니다. 

#### 4. 이미지 최적화
- 이미지 url 수신과 실제 로딩 사이의 간극으로 깜빡임 현상과 UX가 저하되는 문제가 있었습니다. <br/>
  이를 개선하기 위해 **onLoad 카운트를 추적하는 Custom Hook을 구현**하여 전체 이미지가 로드될 때 까지 Skeleton UI를 유지하여 보다 안정적인 이미지 렌더링 경험을 제공했습니다.
- 이미지 업로드 기능 시 **클라이언트에서 WebP 포맷으로 변환 후 업로드**하여 이미지 용량을 줄이고 전송 속도를 개선했습니다. 

#### 5. 공통 컴포넌트 설계
- Compound Component Pattern을 Dropdown, Tab UI에 적용하여 선언형 기반의 유연한 UI 인터페이스를 설계했습니다. <br/>
  Dropdown 내부 로직을 Context로 분리하여 토글/옵션/트리거 등 세부 컴포넌트를 개별 정의하여 다양한 화면에서 조합 형태로 재사용하기 용이했습니다.

#### 6. 테스트 전략
- **Playwright E2E 테스트**를 도메인 단위로 분리 구성하여, PR 변경 범위에 따라 해당 도메인만 선택적으로 테스트가 실행되도록 CI를 설계했습니다. <br/>
  `paths-filter`를 활용해 변경된 파일 경로 기반으로 도메인을 감지하고, `@tag` 기반으로 Playwright 테스트를 선택 실행합니다.
- **Vitest 단위 테스트**를 도입하여 장바구니 훅, 타입 검증 등 핵심 비즈니스 로직의 안정성을 확보했습니다.
- **Git Hook(pre-push)에서 E2E 테스트를 자동 실행**하여, 배포 전 회귀 테스트를 로컬에서 사전 검증합니다.

#### 7. CI/CD 파이프라인
- **Docker 기반 컨테이너화**를 통해 Shop(Next.js)과 Admin(Vite) 앱을 각각 독립적으로 빌드/배포할 수 있도록 구성했습니다.
- GitHub Actions로 **통합 배포 워크플로우**를 구성하고, PR 단위 QA 테스트와 nightly E2E 테스트를 분리 운영합니다.
- `pre-commit`(lint + typecheck) / `pre-push`(build + E2E) **2단계 Git Hook**으로 코드 품질 게이트를 자동화했습니다.

#### 8. DB 설계 고도화
- **Supabase RPC 기반 트랜잭션 처리**를 도입하여, 주문 취소 시 재고 복원 등 다중 테이블 변경이 필요한 작업의 원자성을 보장했습니다.
- 상품 검색 성능 개선을 위해 **trigram 인덱스**를 적용하고, 인기순 정렬을 위한 **materialized view**를 설계했습니다.
- 취소/반품 상태 플로우, 리뷰 테이블 등 **DB 마이그레이션 스크립트를 버전 관리**하여 스키마 변경 이력을 추적합니다.

#### 9. AI 기반 개발 워크플로우 (Claude Code)
- **SDD(Spec-Driven Development) + TDD 파이프라인**을 Claude Code 커스텀 커맨드로 구성했습니다. <br/>
  `/tdd-run` 명령 하나로 `SPEC → RED → GREEN → REFACTOR → VERIFY → SHIP` 6단계 파이프라인이 반자동으로 실행됩니다.
- 각 단계를 독립 커맨드(`/spec`, `/red`, `/green`, `/refactor`, `/verify`)로도 실행할 수 있어, 필요한 단계만 선택적으로 활용할 수 있습니다.
- **AI가 코드를 생성하되, 검증은 결정적 도구(tsc, Biome, Playwright, Vitest)로 수행**하는 원칙을 적용하여 AI 환각에 의한 품질 저하를 방지했습니다.
- 검색/필터, 취소/반품, 리뷰 등 Phase 2 기능 전체를 이 파이프라인으로 구현하여, **명세 작성부터 테스트, 구현, 검증까지의 전체 개발 사이클을 AI와 협업**했습니다.

<br/>


## ERD
![Image](https://github.com/user-attachments/assets/9bdb543f-e414-4cab-ba9b-71f1cbfbcc4d)



### ERD 설계 요약

- 실제 커머스 도메인 흐름을 기반으로 사용자, 상품, 장바구니, 주문, 배송, 결제까지 전반적인 데이터 구조를 설계했습니다. 
- 재고 관리, 주문 확정 전 단계 구분 등 실무 상황을 고려한 테이블 구조를 설계했고, Supabase View를 통해 복잡한 조인 쿼리도 추상화하여 프론트엔드 응답 구조를 간결하게 구성했습니다.

**주요 설계 포인트**
- **OAuth + 커스텀 유저 테이블 분리**  
  소셜 로그인 기반 사용자 인증 + 확장 가능한 사용자 정보 저장

- **재고(Inventory) 테이블 분리**  
  상품 옵션(사이즈 등)을 독립적으로 관리하여 정확한 재고 관리 가능

- **주문 전 단계(OrderSheet)와 실제 주문(Order) 분리**  
  사용자 UX 관점에서 검토/수정 가능한 주문 준비 단계 확보

- **UserAddress 정규화 및 is_default 필드 도입**
  여러 배송지를 저장하고, 기본 배송지 지정 가능

- **취소/반품 상태 플로우**
  `paid → cancelled`, `delivered → return_requested → return_approved → returned` 등 주문 상태 전이를 DB 레벨에서 관리

- **상품 리뷰(ProductReview) 테이블**
  별점, 텍스트, 이미지 URL을 저장하고 구매 확인된 사용자만 작성 가능하도록 자격 검증

- **검색 인덱스 및 Materialized View**
  trigram 인덱스 기반 상품 검색, 주문 수 기반 인기순 정렬용 materialized view

<br/>



