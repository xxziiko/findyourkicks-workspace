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
- **State Management**: `Tanstack Query`, `jotai`
- **Backend**: `Supabase (Auth, DB, Storage)`
- **Monorepo**: `pnpm`, `Turborepo`
- **Deployment**: `Vercel`


<br/>
<br/>

## findyourkicks (`apps/shop`)

>신발 커머스의 실제 사용자 흐름을 구현한 토이 프로젝트입니다. <br/>
>Next.js App Router와 Supabase를 활용하여 **상품 탐색부터 주문까지**의 구매 흐름을 클라이언트 중심으로 설계했습니다. <br/>
>기존 서비스 개발 히스토리는 [findyourkicks 저장소](https://github.com/xxziiko/findyourkicks)에서 확인하실 수 있습니다.

<br/>

#### 보러가기
🔗 https://findyourkicks.shop

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
- 주문 관리

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
 ┃ ┗ 📂product
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┣ 📂mutations
 ┃ ┃ ┃ ┣ 📂queries
 ┣ 📂pages
 ┣ 📂shared
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂layouts
 ┃ ┣ 📂constants
 ┃ ┣ 📂hooks
 ┃ ┣ 📂utils
 ┣ 📂test
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
- Tanstack Query의 **쿼리 키 팩토리 패턴** 방식의 중복과 확장성을 개선하기 위해 **createQueries 커스텀 함수를 구현**했습니다. <br/>
  각 API에 대해 **queryKey, queryFn, 공통 옵션을 선언적으로 정의**할 수 있도록 구성하고 이를 통해 타입 안정성과 쿼리 중복을 개선했습니다.
  
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



