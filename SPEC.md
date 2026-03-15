# FindYourKicks — 프로젝트 요구사항 명세서

스니커즈 이커머스 플랫폼. 고객용 Shop(Next.js)과 관리자용 Admin(React+Vite)으로 구성.

---

## 1. 상품 관리 (Product)

### Shop
- 상품 목록 조회 (무한 스크롤, 25개/페이지)
- 검색: 제목 ILIKE (trigram 인덱스)
- 필터: 브랜드, 카테고리, 사이즈, 가격대
- 정렬: 최신순, 가격순(오름/내림), 인기순(주문 수 기반 materialized view)
- 상품 상세: 제목, 가격, 이미지, 설명, 브랜드, 카테고리, 사이즈별 재고, 평점

### Admin
- 상품 등록: 카테고리, 브랜드, 이름, 가격(>0), 설명, 이미지(1장 이상, WebP 변환), 사이즈+재고(1개 이상), 상태(selling/pending)
- 상품 검색: 제목, 상태, 카테고리, 브랜드, 등록일 기간, 페이지네이션

### 수용 기준
- Given 사용자가 상품 목록에 있을 때, When 브랜드+카테고리 필터 적용, Then 해당 조건의 상품만 표시
- Given 관리자가 상품 등록 시, When 이미지 없이 제출, Then 유효성 에러 표시
- Given 상품 등록 완료 시, When 이미지 업로드, Then WebP로 변환되어 Supabase Storage에 저장

---

## 2. 주문 (Order)

### 상태 흐름
```
paid → preparing → shipping → delivered
paid/preparing → cancelled (취소)
delivered → return_requested → return_approved → returned (반품)
delivered → exchange_requested → exchange_approved → shipped_again (교환)
```

### Shop
- 주문 생성: Toss 결제 성공 후 paymentKey, orderId, amount로 생성
- 주문 내역: 페이지네이션(10개/페이지), 상태별 표시
- 주문 상세: 주문 항목, 상태, 금액, 날짜
- 주문 취소: paid/preparing 상태에서만 가능

### Admin
- 전체 주문 목록 조회
- 최근 주문 조회 (대시보드)

### 수용 기준
- Given 주문이 paid 상태일 때, When 취소 요청, Then 주문 취소 + 재고 자동 복원 (atomic)
- Given 주문이 delivered 상태일 때, When 취소 시도, Then 취소 불가 에러
- Given 결제 성공 시, When 주문 생성, Then paymentKey 검증 후 주문 확정

---

## 3. 결제 (Payment)

### 흐름
주문서 생성 → 결제 페이지 → Toss 결제 SDK → 결제 성공 → 주문 생성

### 수용 기준
- Given 사용자가 결제 페이지에 있을 때, When Toss 결제 완료, Then 주문 생성 및 주문 상세로 이동
- Given 결제 실패 시, When 에러 발생, Then 에러 메시지 표시 및 주문 미생성

---

## 4. 장바구니 (Cart)

### 기능
- 상품 추가 (벌크 추가 지원)
- 수량 변경 (재고 범위 내)
- 상품 삭제
- 장바구니 수량 표시 (헤더)

### Optimistic UI
- 수량 변경/삭제 시 즉시 UI 반영, 실패 시 롤백

### 수용 기준
- Given 장바구니에 상품이 있을 때, When 수량 변경, Then UI 즉시 반영 (서버 동기화는 비동기)
- Given 재고가 5개일 때, When 6개로 변경 시도, Then 재고 초과 에러
- Given 장바구니에서 상품 삭제 시, When 서버 에러, Then 삭제 롤백

---

## 5. 반품/취소/교환 (Returns)

### Shop (고객 요청)
- 반품 요청: delivered 상태 + 주문일 7일 이내
- 교환 요청: delivered 상태 + 주문일 7일 이내
- 사유 + 상세 설명 입력

### Admin (관리자 처리)
- 반품/교환 목록 조회 (상태 필터)
- 승인: 재고 복원 (반품) / 재배송 (교환)
- 거절: 사유와 함께 거절

### 수용 기준
- Given 주문이 delivered 상태이고 7일 이내일 때, When 반품 요청, Then 요청 생성 + 상태 변경
- Given 주문일이 8일 이상 경과 시, When 반품 요청, Then 기간 초과 에러
- Given 관리자가 반품 승인 시, When 승인 처리, Then 재고 자동 복원 (atomic)

---

## 6. 리뷰 (Review)

### 기능
- 리뷰 작성: 평점(1-5, 필수), 내용(최대 1000자), 이미지(최대 3장)
- 리뷰 수정/삭제: 본인 리뷰만
- 평점 요약: 평균, 총 개수, 분포(1~5점별)
- 작성 자격: 구매한 사용자만, 상품당 1회

### 수용 기준
- Given 미구매 사용자가 리뷰 작성 시도, When 작성 폼 접근, Then "구매 후 작성 가능" 안내
- Given 이미 리뷰 작성한 상품, When 재작성 시도, Then "이미 작성됨" 안내
- Given 리뷰 작성 시, When 이미지 4장 첨부, Then 최대 3장 제한 에러

---

## 7. 인증 (Auth)

### Shop
- OAuth 로그인: Google, Kakao (Supabase Auth)
- 테스트 계정 로그인 (개발 환경)
- 로그아웃

### Admin
- 이메일/비밀번호 로그인 (Supabase Auth)
- 비밀번호: 최소 6자
- 로그아웃

### 보안
- RLS: 모든 사용자 데이터 테이블에 auth.uid() 기반 행 수준 보안
- AuthGuard: 비인증 사용자 로그인 페이지 리다이렉트
- Admin: Supabase 세션 토큰 → axios interceptor로 Authorization 헤더 자동 설정

### 수용 기준
- Given 비인증 사용자가 보호된 페이지 접근 시, When 라우트 진입, Then 로그인 페이지로 리다이렉트
- Given 다른 사용자의 주문 조회 시도, When API 호출, Then RLS에 의해 빈 결과 반환

---

## 8. 사용자 (User)

### 배송지 관리
- 배송지 등록: 별칭(1-10자), 수령인(1-10자), 전화번호(11자리), 도로명주소(다음 우편번호 API), 배송 메시지
- 기본 배송지 설정
- 배송지 수정
- 결제 시 배송지 선택

### 수용 기준
- Given 배송지 등록 시, When 전화번호 10자리 입력, Then 11자리 필요 에러
- Given 기본 배송지 설정 시, When 다른 주소를 기본으로 변경, Then 이전 기본 해제
- Given 결제 페이지에서, When 배송지 미선택 시, Then 결제 진행 불가

---

## 9. 주문서 (Order Sheet)

### 흐름
장바구니 → "주문하기" → 주문서 생성 → 주문서 페이지(상품/배송지/금액 확인) → 결제

### 수용 기준
- Given 장바구니에서 주문 클릭 시, When 주문서 생성, Then 장바구니 항목이 주문서로 이전
- Given 주문서 페이지에서, When 배송지 변경, Then 변경된 주소로 결제 진행

---

## 10. 대시보드 (Admin Dashboard)

### 표시 항목
- 최근 주문 목록 (상태 포함)
- 상품 현황 (selling/pending 분포)
- 반품 요청 건수
- 각 섹션 바로가기

### 수용 기준
- Given 관리자가 대시보드 접속 시, When 페이지 로드, Then 최근 주문/상품 현황/반품 건수 표시

---

## 비기능 요구사항

- **성능**: 이미지 WebP 최적화, TanStack Query 캐싱(staleTime 60분), 무한 스크롤
- **보안**: Supabase RLS, 인증 토큰 관리, CORS 설정
- **접근성**: 모바일 반응형 (380px 기준 디바이스 사이즈)
- **데이터 무결성**: 주문/취소/반품의 atomic 트랜잭션 (Supabase RPC)
- **개발 경험**: Biome 린트/포맷, TypeScript strict, 컨벤셔널 커밋

---

## 데이터베이스 핵심 테이블

| 테이블 | 용도 |
|--------|------|
| products | 상품 카탈로그 |
| inventory | 사이즈별 재고 |
| orders | 주문 기록 |
| order_items | 주문 항목 |
| order_sheets | 주문서 (결제 전 초안) |
| user_addresses | 배송지 |
| product_reviews | 상품 리뷰 (UNIQUE: user+product) |
| order_cancellations | 취소 기록 |
| order_returns | 반품/교환 요청 |

### 주요 View/RPC
- `product_popularity` — 상품 인기도 (materialized view)
- `product_rating_summary` — 상품 평점 요약
- `cancel_order_after_toss()` — 취소 + 재고 복원 (atomic)
- `approve_return_request()` — 반품 승인
- `request_return_for_order()` — 반품 요청 (7일 검증)
