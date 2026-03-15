# Admin QA Plan — agent-browser CLI

## Context
어드민 앱(`apps/admin`)의 전반적인 QA를 `agent-browser` CLI(v0.16.3)로 수행한다.
- 테스트 계정: `admin@example.com` / `admin123`
- 어드민 서버: `http://localhost:5173` (이미 실행 중)
- 브라우저 데몬 방식으로 `&&` 체이닝으로 명령 실행

## Pages & Routes
| 경로 | 페이지 | 구현 상태 |
|------|--------|-----------|
| `/login` | 로그인 | ✅ |
| `/` | 대시보드 | ✅ |
| `/products` | 상품 목록 | ✅ |
| `/products/new` | 상품 등록 | ✅ |
| `/orders` | 주문 관리 | ⚠️ "페이지 준비중" |
| `/returns` | 반품/교환 관리 | ✅ |

## QA Scenarios & Commands

### Phase 1: 로그인
```bash
# 1-1. 빈 폼 제출 → 유효성 에러 확인
agent-browser open http://localhost:5173/login && \
  agent-browser find role button click --name 로그인 && \
  agent-browser screenshot qa/01-empty-form-error.png && \
  agent-browser snapshot -i

# 1-2. 잘못된 자격증명
agent-browser fill 'input[type=email]' 'wrong@test.com' && \
  agent-browser fill 'input[type=password]' 'wrong' && \
  agent-browser find role button click --name 로그인 && \
  agent-browser screenshot qa/02-wrong-credentials.png

# 1-3. 정상 로그인
agent-browser fill 'input[type=email]' 'admin@example.com' && \
  agent-browser fill 'input[type=password]' 'admin123' && \
  agent-browser find role button click --name 로그인 && \
  agent-browser wait --load networkidle && \
  agent-browser get url   # 대시보드(/) 로 이동 확인
```

### Phase 2: 대시보드
```bash
agent-browser screenshot qa/03-dashboard.png && \
  agent-browser snapshot -c   # 카드 섹션 렌더링 확인
```

### Phase 3: 상품 목록
```bash
agent-browser open http://localhost:5173/products && \
  agent-browser wait --load networkidle && \
  agent-browser screenshot qa/04-products.png && \
  agent-browser snapshot -i   # 필터 + 목록 테이블 확인

# 검색 필터 동작
# (snapshot에서 ref 확인 후 fill + submit)
agent-browser screenshot qa/05-products-filtered.png

# 필터 초기화
agent-browser screenshot qa/06-products-reset.png
```

### Phase 4: 상품 등록
```bash
agent-browser open http://localhost:5573/products/new && \
  agent-browser wait --load networkidle && \
  agent-browser screenshot qa/07-product-register.png && \
  agent-browser snapshot -i

# 빈 폼 제출 → 유효성 에러
# 임시저장 버튼 클릭 → localStorage 확인
agent-browser eval 'localStorage.getItem("draft")'
```

### Phase 5: 주문 관리
```bash
agent-browser open http://localhost:5173/orders && \
  agent-browser screenshot qa/08-orders.png && \
  agent-browser get text 'div'   # "페이지 준비중" 텍스트 확인
```

### Phase 6: 반품/교환 관리
```bash
agent-browser open http://localhost:5173/returns && \
  agent-browser wait --load networkidle && \
  agent-browser screenshot qa/09-returns.png && \
  agent-browser snapshot -i   # 필터 탭 + 테이블 확인

# 탭 필터 순서대로 클릭 (전체/처리대기/승인/거부)
# 처리대기 탭에서 승인/거부 버튼 확인
```

### Phase 7: 네비게이션 & 404
```bash
agent-browser open http://localhost:5173/not-exist && \
  agent-browser screenshot qa/10-404.png

# 로그아웃 확인
agent-browser snapshot -i   # 로그아웃 버튼 찾기
```

## Execution Strategy
1. `qa/` 디렉터리에 스크린샷 저장
2. 각 단계에서 `snapshot -i`로 접근 가능한 요소 확인 후 ref 기반 조작
3. `console` 명령으로 JS 에러 체크
4. 마지막에 이슈 목록을 마크다운 형식으로 요약

## Verification
- 각 스크린샷으로 시각적 확인
- `agent-browser errors` 로 페이지 에러 확인
- QA 결과 보고서 작성
