<div align="center">
<img width="474" alt="Image" src="https://github.com/user-attachments/assets/97ad32e6-adb1-41d5-9b19-818e0641a7e6" />
</div>

<br/>
<br/>

> **신발 커머스 서비스 `findyourkicks`와 관리자 페이지를 함께 관리하는 모노레포 레포지토리입니다.**  
> 사용자 웹앱은 `Next.js App Router` 기반으로 제작되었고, 관리자(Admin) 웹앱은 `React + Vite`로 개발 중입니다.  
> 인증부터 DB 설계, API 연동까지 `Supabase`를 기반으로 전체 흐름을 직접 구성했습니다.

<br/>
<br/>

### 🗂️ 레포 구성
- 사용자 서비스: `apps/shop` (Next.js + App Router)
- 관리자 서비스: `apps/admin` (React + Vite)
- 공통 패키지: `packages/shared` (UI, 유틸, 스타일 등)

### 기술 스택
- **Frontend**: `TypeScript`, `SCSS`
- **State Management**: `Tanstack Query`, `jotai`
- **Backend**: `Supabase (Auth, DB, Storage)`
- **Monorepo**: `pnpm`, `Turborepo`
- **Deployment**: `Vercel`

<br/>
<br/>

> ⚠️ 현재 `apps/admin`은 개발 중이며, 우선 `apps/shop` 중심으로 설명합니다.


<br/>
<br/>

### 관리자 페이지 (`apps/admin`)


### 작업기간
2025.05 ~  



<br/>
<br/>

### findyourkicks (`apps/shop`)

>신발 커머스의 실제 사용자 흐름을 구현한 토이 프로젝트입니다. <br/>
>Next.js App Router와 Supabase를 활용하여 **상품 탐색부터 주문까지**의 구매 흐름을 클라이언트 중심으로 설계했습니다.

<br/>

#### 보러가기
🔗 https://findyourkicks.vercel.app/ 

#### 작업기간
2025.02 ~ 2025.05

<br/>

## 주요 기능
- 상품 목록/상세 페이지
- 장바구니 담기 / 주문하기
- 배송지 입력 및 관리
- 주문 내역 조회


<br/>

## 폴더구조

```
📦src
 ┣ 📂app
 ┃ ┣ 📂(auth)
 ┃ ┣ 📂(order-flow)
 ┃ ┣ 📂(shop)
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂cart
 ┃ ┃ ┣ 📂order-sheets
 ┃ ┃ ┣ 📂orders
 ┃ ┃ ┣ 📂payments
 ┃ ┃ ┣ 📂products
 ┃ ┃ ┗ 📂users
 ┣ 📂features
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┣ 📂hooks
 ┃ ┣ 📂cart
 ┃ ┣ 📂order
 ┃ ┣ 📂order-sheet
 ┃ ┣ 📂payment
 ┃ ┣ 📂product
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



## 구현 및 학습 포인트

#### 1. 아키텍처 설계
- **Feature-Sliced 구조**를 기반으로 도메인 단위 책임 분리
- `features/`, `shared/`, `app/`의 3계층 설계
- App Router의 서버/클라이언트 컴포넌트 분리와 동적 라우팅 학습

#### 2. 상태관리 전략
**Tanstack Query + jotai 조합을 통해 서버/클라이언트 상태 분리**
- jotai로 인증, UI 상태 등 클라이언트 전역 상태 관리
- Tanstack Query로 서버 상태 캐싱 및 비동기 요청 처리

**쿼리 키 팩토리 패턴 적용**
- 쿼리 키를 공통 모듈에서 선언하여 타입 안전성과 캐시 재사용성 확보

**커스텀 훅 설계 패턴**
- jotai와 query를 훅 내부에서 조합하여 상태 흐름 추상화
- mutation은 독립 모듈로 만들어 컴포넌트에서 선언형 호출
- 각 도메인(`cart`, `order`, `auth`) 별로 기능 단위의 훅을 분리하여 모듈화


#### 3. 데이터 흐름 및 설계
- RESTful API 엔드포인트 설계 및 응답 형태 정리
- Supabase를 통한 인증 / DB 연동 / API 설계
- ERD 및 도메인 기반 테이블 설계

#### 4. 스타일링
- SCSS와 CSS Modules를 활용해 컴포넌트 스타일을 모듈 단위로 관리
- 공통 스타일(`mixins.scss`, `variables.scss`)을 분리하여 색상, 사이즈, 반응형, 여백 등 반복되는 패턴을 추상화


#### 5. 성능 및 UX 최적화
- 이미지 로딩 시점까지 고려한 Skeleton UX 개선
   - 전체 이미지가 로딩될 때까지 Skeleton을 유지하도록 `useImagesLoaded` 훅을 구현


<br/>

## 트러블 슈팅

**무한스크롤 페이지네이션에서 동일한 데이터가 반복해서 조회되는 현상**
 - DB에서 두 레코드의 정렬 순서가 보장되지 않아 중복 데이터가 발생 <br/>
 - 정렬 기준을 고유 ID인 `product_id`로 변경하여 해결
 - 👉 [자세히 보러가기](https://xxziiko.notion.site/1da4ae05ecc7802cbc27da7f6de2679f?pvs=74)

**결제 완료 후 장바구니 항목 삭제가 안되는 현상**
- 결제 완료 후, `order_sheet_items`와 `cart_items` 간 직접적인 참조 관계가 없어 구매한 항목을 장바구니에서 정확히 삭제할 수 없는 문제가 발생
- `order_sheet_items` 테이블에 `cart_item_id` 컬럼을 추가하고 해당 값을 기반으로 삭제 대상을 명확하게 식별할 수 있도록 개선
- 👉 [자세히 보러가기](https://xxziiko.notion.site/1da4ae05ecc78004bc9fe0790f44c96c)

<br/>

## 성능 개선

**테이블 조인 → view 변경으로 TTFB 개선**
- Supabase의 조인 응답 속도가 느리고, 중첩 응답으로 인해 정확한 타입 추론이 어려웠음
- View 테이블을 생성하여 타입 추론이 명확해지고, 네트워크 대기 시간(TTFB) 기준으로 1.12s → 186ms으로 약 83% 응답 속도 개선
- 👉 [자세히 보러가기](https://xxziiko.notion.site/view-TTFB-1dd4ae05ecc780d7b2b0d68c0a88c999)


<br/>


## 페이지
|메인 페이지|상세 페이지|
|----|----|
|<img width="100%" alt="Image" src="https://github.com/user-attachments/assets/b1f1ab76-c23d-4296-aaa3-ff5d3c5e1f8f" />|<img width="100%" alt="Image" src="https://github.com/user-attachments/assets/460ae79e-da93-4ce5-a40c-838b8112e6fd" />|

|로그인 페이지|장바구니 페이지|
|----|----|
|<img width="100%" alt="Image" src="https://github.com/user-attachments/assets/665dd1f1-20bd-4e31-ac0f-dea4bba582aa" />|<img width="100%" alt="Image" src="https://github.com/user-attachments/assets/a541d0bc-8414-48ae-8640-61387d26434c" />|

|주문 페이지|결제 페이지|
|----|----|
| <img width="100%" alt="Image" src="https://github.com/user-attachments/assets/0b99240f-9744-429d-b419-b52b7e61247b" />|<img width="100%" alt="Image" src="https://github.com/user-attachments/assets/04a8cbb7-ebf4-4d5a-8a34-1b0703d92080" />

|결제완료 페이지|주문 내역|
|---|---|
|<img width="100%" alt="Image" src="https://github.com/user-attachments/assets/621301e5-5d9b-451e-986e-c1bfeb0f11fa" />|<img width="100%" alt="Image" src="https://github.com/user-attachments/assets/9806f841-430f-4877-ab72-dcfc4deca2d7" />|

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

<br/>



