# CCG-MCP 분석: 모듈 보안 + 로그인 UX 개선안

---

## Codex 타임아웃 디버깅 결과

### 진단
- **Codex CLI 자체는 정상**: `codex exec "Say hello"` → 15초 이내 완료
- **모델**: `gpt-5.3-codex` / **인증**: 정상 / **설정**: `~/.codex/config.toml` 없음 (기본값 사용)

### 근본 원인
`codex exec`는 단순 LLM 호출이 아니라 **에이전틱 루프**다. 복잡하고 긴 프롬프트(파일 경로 다수 포함)를 받으면:
1. 지정된 워킹 디렉터리(`/louisville`)에서 **실제 파일을 읽기 시작**
2. 여러 차례 API 호출 반복
3. 기본 타임아웃 90초를 초과

MCP 브릿지 코드(`mcp_server.py:99`): `CODEX_TIMEOUT` 환경변수가 없으면 90초 하드코딩.
실제로 내가 보낸 프롬프트는 ~2,000 토큰 + 파일 경로 14개 → codex가 파일 탐색 시작 → 타임아웃.

### 해결 방법 (3가지 옵션)

| 방법 | 설명 | 난이도 |
|------|------|--------|
| **A. CODEX_TIMEOUT 환경변수 설정** | MCP 서버 설정에 `CODEX_TIMEOUT=300` 추가 | 쉬움 |
| **B. 호출 시 timeout 파라미터 지정** | `consult_codex(timeout=300, ...)` | 쉬움 |
| **C. 프롬프트 분할** | 긴 프롬프트를 짧은 여러 호출로 분리 | 중간 |

### 권장 조치
**즉시**: `consult_codex` 호출 시 항상 `timeout=180~300` 명시적 전달
**영구적**: MCP 서버 환경변수에 `CODEX_TIMEOUT=300` 추가

MCP 서버 설정 위치: `~/.claude/settings.json`의 `mcpServers` → 현재 설정 없음, Claude Code가 자동으로 MCP를 로드하는 방식으로 동작 중. 환경변수를 시스템 레벨(`~/.zshrc`)에 추가하는 것이 가장 간단.

```bash
# ~/.zshrc에 추가
export CODEX_TIMEOUT=300
```

---

> **분석 모델:** Gemini (UX) + Claude (Security) — Codex 타임아웃으로 Claude가 보안 분석 대체
> **대상 프로젝트:** FindYourKicks (louisville monorepo)

---

## Context

FindYourKicks는 Shop(Next.js 15.3.2)과 Admin(React + Vite) 두 앱으로 구성된 e-commerce 플랫폼이다.
Shop은 Google/Kakao OAuth + 테스트 계정, Admin은 이메일/비밀번호 방식을 사용하며 Supabase Auth + HTTP-only 쿠키로 세션을 관리한다.
이번 검토는 현재 auth 아키텍처의 보안 취약점과 로그인 UX 마찰 요소를 식별하고 우선순위별 개선안을 도출하는 것이다.

---

## 1. 보안 분석 (Claude)

### Critical
| 항목 | 파일 | 설명 |
|------|------|------|
| 테스트 계정 엔드포인트 프로덕션 노출 | `apps/shop/src/app/api/auth/test-account/route.ts` | 프로덕션 빌드에 테스트 로그인 경로가 열려 있음. 누구나 접근 가능. `NODE_ENV` 체크 또는 env 플래그로 비프로덕션 환경에서만 활성화 필요 |
| OAuth 콜백 CSRF 보호 미확인 | `apps/shop/src/app/api/auth/callback/route.ts` | state 파라미터 검증 여부 확인 필요. Supabase가 내부 처리한다면 OK, 커스텀 로직 있다면 CSRF 취약점 |

### High
| 항목 | 파일 | 설명 |
|------|------|------|
| Admin 비밀번호 최소 6자 | `apps/admin/src/features/auth/api/signIn.ts` | 짧은 패스워드 허용. 최소 8자 + 대소문자/숫자 조합 권장. Supabase 대시보드에서 Password Policy 강화 필요 |
| 미인증 API 응답이 500 | 모든 API routes | 401 Unauthorized 반환해야 함. 500은 내부 오류로 오해될 수 있고 스택 노출 위험 |
| Admin AuthGuard 클라이언트 전용 보호 | `apps/admin/src/features/auth/components/AuthGuard.tsx` | Admin은 Next.js 미들웨어가 없는 Vite SPA. JS 비활성화 시 보호 우회 가능. Supabase JWT 검증을 API 레벨에서 강제해야 함 |

### Medium
| 항목 | 파일 | 설명 |
|------|------|------|
| 보호 경로 명시적 목록 관리 | `apps/shop/src/shared/constants/path.ts` | `AUTH_PATHS` 배열에 새 경로 추가를 누락하면 미보호 상태로 배포될 위험. 미들웨어를 allowlist 방식(공개 경로만 허용, 나머지는 보호)으로 전환 권장 |
| Rate Limiting 미적용 | `apps/shop/src/app/api/auth/` | 로그인 시도 횟수 제한 없음. Brute-force 공격에 노출. Supabase 또는 Edge 레벨에서 rate limiting 적용 |
| Supabase anon key 클라이언트 노출 | `apps/shop/src/shared/utils/supabase/client.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` 노출은 Supabase 설계상 정상이나, RLS(Row Level Security) 정책이 제대로 설정되지 않으면 데이터 노출 가능. RLS 활성화 여부 감사 필요 |

---

## 2. UX 분석 (Gemini)

### Critical
| 항목 | 대상 | 설명 |
|------|------|------|
| Admin "비밀번호 찾기" 없음 | Admin Login | 관리자가 비밀번호 분실 시 자체 복구 불가. 개발팀 지원 필요 → 운영 부담 |
| Shop 이메일/비밀번호 로그인 없음 | Shop Login | Google/Kakao 계정 없는 사용자 완전 배제. 이메일 로그인 추가 또는 Magic Link 대안 필요 |
| 접근성 감사 미실시 | 전체 | 키보드 내비게이션, ARIA 속성, 포커스 표시자 미검증. WCAG 2.1 AA 미준수 가능성 |

### High
| 항목 | 대상 | 설명 |
|------|------|------|
| AuthGuard 초기 인증 체크 중 콘텐츠 플래시 | `AuthGuard.tsx` (양 앱) | 인증 확인 중 미인증 콘텐츠가 순간 노출될 수 있음. 전체 로딩 스피너/스켈레톤 필요 |
| Privacy Policy / Terms 링크 누락 | Shop Login | OAuth 사용 시 법적 필수 요소. 부재 시 GDPR/개인정보 처리방침 위반 소지 |
| OAuth 실패 시 에러 메시지 불명확 | Shop Login | 사용자 취소, 네트워크 오류, 제공자 오류 구분 없이 동일한 에러 표시 가능성 |
| 테스트 계정 버튼 과도한 노출 | Shop Login | 일반 사용자에게 혼란. 비프로덕션 전용으로 격리하거나 환경변수로 제어 |

### Medium
| 항목 | 대상 | 설명 |
|------|------|------|
| Admin 비밀번호 강도 표시 없음 | Admin Login | 입력 중 강도 표시로 보안 의식 제고 |
| Shop ↔ Admin 로그인 경험 불일치 | 전체 | 브랜드 일관성 부족. 에러 메시지 스타일, 로딩 패턴 통일 권장 |
| 모바일 터치 타겟 크기 미검증 | 양 앱 | WCAG 2.1 AA 최소 44×44px 권장 |

---

## 3. 종합 우선순위 액션 플랜

```
Priority 1 (즉시 수정 - 보안)
├── 테스트 계정 엔드포인트를 env 플래그로 프로덕션 비활성화
├── 미인증 API 응답 500 → 401로 수정
└── Admin 비밀번호 정책 강화 (min 8자 + Supabase Policy)

Priority 2 (1주 내 - 보안+UX)
├── 보호 경로 방식을 blocklist → allowlist로 전환
├── Admin "비밀번호 찾기" 구현 (Supabase resetPasswordForEmail)
├── AuthGuard 로딩 상태 스켈레톤 추가
└── OAuth 콜백 CSRF state 파라미터 검증 확인

Priority 3 (2주 내 - UX)
├── Shop 이메일 로그인 또는 Magic Link 추가
├── Privacy Policy / Terms 링크 추가
├── 에러 메시지 구체화 (OAuth 실패 유형별 분리)
└── 접근성 감사 (키보드 내비게이션, ARIA, 색상 대비)

Priority 4 (점진적 개선)
├── Rate limiting 적용 (Supabase 또는 Vercel Edge)
├── Admin 비밀번호 강도 인디케이터
├── 모바일 터치 타겟 최적화
└── Supabase RLS 정책 감사
```

---

## 4. 수정 대상 핵심 파일

| 파일 | 수정 내용 |
|------|-----------|
| `apps/shop/src/app/api/auth/test-account/route.ts` | `NODE_ENV !== 'production'` 가드 추가 |
| `apps/shop/src/app/api/auth/callback/route.ts` | CSRF state 검증 확인 |
| `apps/shop/src/shared/constants/path.ts` | allowlist 방식으로 미들웨어 전환 |
| `apps/shop/src/shared/utils/supabase/middleware.ts` | 보호 경로 로직 역전 |
| `apps/admin/src/features/auth/api/signIn.ts` | 비밀번호 정책 강화 (8자 이상) |
| `apps/admin/src/pages/Login.tsx` | "비밀번호 찾기" 링크 추가 |
| `apps/shop/src/features/auth/components/AuthGuard.tsx` | 로딩 스켈레톤 추가 |
| `apps/admin/src/features/auth/components/AuthGuard.tsx` | 로딩 스켈레톤 추가 |
| 모든 `apps/shop/src/app/api/*/route.ts` | 401 반환으로 통일 |

---

## 5. 검증 방법

- `NODE_ENV=production` 환경에서 `/api/auth/test-account` 접근 시 404/403 반환 확인
- 미인증 상태에서 보호 API 호출 → 401 응답 확인
- Admin 로그인 6자 미만 비밀번호 → Supabase 레벨에서 거부 확인
- AuthGuard 로딩 중 콘텐츠 플래시 없음 확인
- Axe DevTools 또는 Lighthouse 접근성 스코어 측정
