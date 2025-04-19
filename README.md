<div align="center">
<img width="474" alt="Image" src="https://github.com/user-attachments/assets/97ad32e6-adb1-41d5-9b19-818e0641a7e6" />
</div>

### 보러가기 
🔗 https://findyourkicks.vercel.app/

<br/>


>신발 커머스의 실제 사용자 흐름을 구현한 풀스택 웹 프로젝트입니다. <br/>
>Next.js App Router와 Supabase를 활용하여 **상품 탐색부터 주문까지**의 구매 흐름을 클라이언트 중심으로 설계했습니다.




<br/>


### 기술스택
- **Frontend**: `Next.js (App Router)`, `TypeScript`, `SCSS`
- **State Management**: `Tanstack Query`, `jotai`
- **Backend**: `Supabase (Auth, DB, Storage)`
- **Deployment**: `Vercel`





<br/>

### 주요 기능

### **👟 사용자(프론트) 기능**

- 상품 목록/상세 페이지
- 장바구니 담기 / 주문하기
- 배송지 입력 및 관리
- 주문 내역 조회 (진행중)

### **🛠️ 관리자(어드민) 기능 (진행중)**

- 상품 등록/수정/삭제
- 재고 관리
- 주문 처리 상태 변경
- 통계 대시보드

<br/>

### 폴더구조

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

### ERD 설계 요약

- 실제 커머스 도메인 흐름을 기반으로 사용자, 상품, 장바구니, 주문, 배송, 결제까지 전반적인 데이터 구조를 직접 설계했습니다. 
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

### ERD
![Image](https://github.com/user-attachments/assets/9bdb543f-e414-4cab-ba9b-71f1cbfbcc4d)


<br/>

### 구현 및 학습 포인트

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
- RESTfull API 엔드포인트 설계 및 응답 형태 정리
- Supabase를 통한 인증 / DB 연동 / API 설계
- ERD 및 도메인 기반 테이블 설계

#### 4. 스타일링
- SCSS와 CSS Modules를 활용해 컴포넌트 스타일을 모듈 단위로 관리
- 공통 스타일(`mixins.scss`, `variables.scss`)을 분리하여 색상, 사이즈, 반응형, 여백 등 반복되는 패턴을 추상화


#### 5. 성능 및 UX 최적화
- 이미지 로딩 시점까지 고려한 Skeleton UX 개선
   - 전체 이미지가 로딩될 때까지 Skeleton을 유지하도록 `useImagesLoaded` 훅을 구현

<!-- #### 5. 컴포넌트 설계 --!>




