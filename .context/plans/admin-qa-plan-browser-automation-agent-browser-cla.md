# Admin QA Plan — Browser Automation (agent-browser / claude-in-chrome)

## Context
어드민 앱(`apps/admin`)의 전반적인 QA를 브라우저 자동화(mcp__claude-in-chrome)로 수행한다.
테스트 계정: `admin@example.com` / `admin123`
어드민 서버: `http://localhost:5173` (Vite dev server, `pnpm dev:admin` 또는 `turbo dev --filter=admin`)

## Pages & Routes
| 경로 | 페이지 | 구현 상태 |
|------|--------|-----------|
| `/login` | 로그인 | ✅ |
| `/` | 대시보드 | ✅ |
| `/products` | 상품 목록 | ✅ |
| `/products/new` | 상품 등록 | ✅ |
| `/orders` | 주문 관리 | ⚠️ "페이지 준비중" |
| `/returns` | 반품/교환 관리 | ✅ |

## QA Scenarios

### 1. 인증 (Login)
- [ ] 빈 폼 제출 → 유효성 에러 노출
- [ ] 잘못된 이메일/비밀번호 → 에러 메시지
- [ ] 올바른 계정 로그인 → `/` 대시보드 이동

### 2. 대시보드 (Dashboard)
- [ ] 최근 주문 내역 카드 렌더링
- [ ] 최근 등록 상품 카드 렌더링
- [ ] 상품 통계 카드 렌더링
- [ ] 주문 항목 클릭 → `/orders/:id` 이동

### 3. 상품 목록 (Products)
- [ ] 상품 목록 테이블 렌더링 / 페이지네이션
- [ ] 검색 필터 동작 (이름, 상태 등)
- [ ] 필터 초기화 버튼
- [ ] 상품 상태 요약(판매중/품절)

### 4. 상품 등록 (Products/new)
- [ ] 기본 정보 폼 렌더링 (이름, 가격 등)
- [ ] 옵션/사이즈 테이블 입력
- [ ] 이미지 업로드 프리뷰
- [ ] 임시저장 → localStorage 저장
- [ ] 폼 초기화 버튼
- [ ] 필수값 미입력 시 유효성 에러
- [ ] 정상 등록 → 완료 모달 → 홈/추가 버튼

### 5. 주문 관리 (Orders)
- [ ] "페이지 준비중" 텍스트 노출 확인

### 6. 반품/교환 관리 (Returns)
- [ ] 전체/처리대기/승인/거부 탭 필터
- [ ] 반품 테이블 렌더링 (주문ID, 상품명, 유형, 사유, 상태, 신청일)
- [ ] 처리대기 항목: 승인/거부 버튼 노출
- [ ] 이미 처리된 항목: "처리 완료" 표시
- [ ] 승인 버튼 클릭 → 상태 변경 확인
- [ ] 거부 버튼 클릭 → 상태 변경 확인

### 7. 네비게이션 / 레이아웃
- [ ] 사이드바/헤더 메뉴로 각 페이지 이동
- [ ] 로그아웃 동작
- [ ] 404 페이지 (`/not-exist`)

## Execution Steps

1. **서버 상태 확인**: 현재 탭 컨텍스트 확인 후 `http://localhost:5173` 접근 시도
2. **GIF 녹화**: 각 주요 섹션별로 gif_creator로 녹화
3. **순서**: Login → Dashboard → Products → Products/new → Orders → Returns → Layout/Nav
4. **이슈 기록**: 버그/예상과 다른 동작은 콘솔 로그 포함해서 문서화

## Verification
- 각 시나리오에서 스크린샷 + 콘솔 에러 체크
- 네트워크 요청 실패 여부 `read_network_requests`로 확인
- QA 결과를 마지막에 마크다운 형식으로 요약 보고
