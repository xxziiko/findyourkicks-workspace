# 모듈 보안 + 로그인 UX 개선 플랜

## Context

FindYourKicks(스니커 이커머스) 프로젝트에서 CCG-MCP 병렬 분석(Codex: 보안, Gemini: UX)을 수행한 결과, 즉시 수정이 필요한 Critical 취약점 3개와 로그인 UX 개선 포인트 5개를 도출했다.

---

## 1. 보안 취약점 수정 (Codex 분석)

### Critical (즉시 처리)

#### VULN-001: IDOR — 주문 상세 엔드포인트
- **파일:** `apps/shop/src/app/api/orders/[orderId]/route.ts`
- **문제:** GET 요청 시 요청 유저가 해당 주문의 소유자인지 검증 없음 → 타인 주소/결제정보 열람 가능
- **수정:** `getUser()` 후 `order.user_id !== user.id` 이면 403 반환

```ts
const { data: auth } = await supabase.auth.getUser();
if (!auth?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

const { data: order } = await supabase.from('orders').select('user_id, ...').eq('order_id', orderId).single();
if (!order || order.user_id !== auth.user.id)
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
```

#### VULN-002: 테스트 계정 엔드포인트 프로덕션 노출
- **파일:** `apps/shop/src/app/api/auth/test-account/route.ts`
- **수정:** `NODE_ENV === 'production'` 또는 `ENABLE_TEST_ACCOUNT_LOGIN !== 'true'` 이면 404 반환

```ts
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_TEST_ACCOUNT_LOGIN !== 'true')
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
```

#### VULN-003: 주문 생성 시 order_sheet 소유권 미검증
- **파일:** `apps/shop/src/app/api/orders/route.ts` (POST)
- **수정:** `order_sheets` 조회 후 `sheet.user_id !== user.id`이면 403, 금액 불일치 시 400

### High

#### VULN-004: CSRF 보호 부재
- **신규 파일:** `apps/shop/src/shared/security/csrf.ts`
- Origin-Host 비교 유틸 `assertSameOrigin()` 생성 후 모든 POST/PATCH/DELETE 라우트에 적용

### Medium

#### VULN-005: admin returns status 파라미터 미검증
- **파일:** `apps/shop/src/app/api/admin/returns/route.ts`
- zod `z.enum(['requested','approved','rejected','completed'])` 으로 파싱 후 적용

#### VULN-007: 인증 userId 접근 패턴 불일치
- **신규 파일:** `apps/shop/src/shared/auth/require-user.ts`
- `requireUserId()` 헬퍼 생성 → 모든 API 라우트에서 재사용

### Low

#### VULN-006: Supabase RLS 강화
- DB 수준 RLS 정책 확인 및 `orders`, `addresses`, `payments` 테이블에 `auth.uid() = user_id` 정책 보강

---

## 2. 로그인 UX 개선 (Gemini 분석)

### UX-001: OAuth 클릭 후 로딩 상태 없음 (최우선)
- **파일:** `apps/shop/src/features/auth/components/LoginCardButtons.tsx`
- `useState<'google'|'kakao'|null>(null)` 로 로딩 프로바이더 추적
- 클릭 시 버튼 비활성화 + 스피너 표시 + "Redirecting..." 텍스트

### UX-002: OAuth 실패 시 에러 UI 없음
- **파일:** `apps/shop/src/app/api/auth/callback/route.ts` + `/app/(auth)/login/page.tsx`
- 콜백 실패 시 `/login?error=access_denied` 로 리다이렉트
- 로그인 페이지에서 `useSearchParams()`로 에러 파라미터 감지 → 에러 배너 표시

### UX-003: 로그인 후 원래 목적지 URL 미보존
- **파일:** `apps/shop/src/shared/utils/supabase/middleware.ts`
- 미인증 유저가 보호 경로 접근 시 `/login?redirect_to=<원래경로>` 로 리다이렉트
- **파일:** `apps/shop/src/features/auth/components/AuthGuard.tsx`
- 로그인 성공 후 `redirect_to` 파라미터 확인 → 해당 경로로 이동

### UX-004: 어드민 로그인 비밀번호 표시 토글 없음
- **파일:** `apps/admin/src/features/auth/components/` (로그인 폼 컴포넌트)
- `PasswordInput` 재사용 컴포넌트 분리 (eye 아이콘 + show/hide 상태)

### UX-005: 테스트 계정 버튼 UI 노출
- **파일:** `apps/shop/src/features/auth/components/LoginCardButtons.tsx`
- `process.env.NEXT_PUBLIC_ENABLE_TEST_ACCOUNT === 'true'` 조건부 렌더링으로 프로덕션에서 숨김
- VULN-002 백엔드 수정과 함께 처리

---

## 3. 권장 사항 (Codex + Gemini 공통)

| 우선순위 | 항목 |
|---------|------|
| 1 | VULN-001/002/003 즉시 패치 후 배포 |
| 2 | RLS 정책 전수 감사 (DB 1차 방어선) |
| 3 | `requireUserId()` 헬퍼 통합 + CSRF 유틸 추가 |
| 4 | UX-001~003 로그인 플로우 개선 |
| 5 | UX-004~005 어드민/테스트계정 정리 |
| 6 | Rate limiting 추가 (auth/order/payment 엔드포인트) |
| 7 | 보안 통합 테스트 작성 (IDOR, 권한 우회 회귀 방지) |

---

## 4. 수정 대상 파일 요약

**보안:**
- `apps/shop/src/app/api/orders/[orderId]/route.ts`
- `apps/shop/src/app/api/orders/route.ts`
- `apps/shop/src/app/api/auth/test-account/route.ts`
- `apps/shop/src/app/api/admin/returns/route.ts`
- `apps/shop/src/shared/auth/require-user.ts` (신규)
- `apps/shop/src/shared/security/csrf.ts` (신규)

**UX:**
- `apps/shop/src/features/auth/components/LoginCardButtons.tsx`
- `apps/shop/src/app/(auth)/login/page.tsx`
- `apps/shop/src/app/api/auth/callback/route.ts`
- `apps/shop/src/shared/utils/supabase/middleware.ts`
- `apps/shop/src/features/auth/components/AuthGuard.tsx`
- `apps/admin/src/features/auth/components/` (비밀번호 토글)

---

## 5. 검증 방법

1. **IDOR 테스트:** 유저 A 로그인 후 유저 B의 orderId로 GET → 403 확인
2. **테스트 계정:** 프로덕션 빌드에서 `/api/auth/test-account` 호출 → 404 확인
3. **주문 생성:** 다른 유저의 order_sheet_id로 POST → 403 확인
4. **리다이렉트 보존:** `/cart` 접근 → 로그인 → `/cart` 로 돌아오는지 확인
5. **OAuth 로딩:** Google 버튼 클릭 시 스피너 표시 + 버튼 비활성화 확인
6. **에러 처리:** OAuth 거부 시 `/login?error=access_denied` 리다이렉트 + 에러 메시지 확인
7. E2E 테스트: `apps/shop/src/tests/` 에 auth 보안 시나리오 추가
