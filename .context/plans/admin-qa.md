# Plan: Admin QA 시나리오 수정

## Context

이전 dogfood QA 세션에서 admin 페이지 QA를 수행했으나 일부 시나리오가 실패함. 앱 로직 버그(Returns API 누락, 상품 목록 파라미터 불일치, 취소 버튼 네비게이션, 대시보드 통계 하드코딩)는 이미 수정됨. 현재 남아있는 문제는 QA 시나리오 스크립트가 실제 UI와 맞지 않는 부분. 시나리오를 실제 코드와 일치시켜 테스트가 통과하도록 수정.

---

## 발견된 불일치 목록

### scripts/qa/scenarios/admin/product.sh

| # | 구분 | 현재 (시나리오) | 실제 (앱) | 심각도 |
|---|------|----------------|-----------|--------|
| 1 | 라디오 버튼 value | `input[value="판매 대기"]` | `input[value="pending"]` | **Critical** – 등록 시 status 미설정 → 유효성 검사 실패 |
| 2 | Dropdown 트리거 | `querySelector('[data-testid="category"]')?.click()` | Dropdown container div에 testid 있으나 내부 trigger 버튼 클릭이 더 안정적 | Medium – 간헐적 미동작 |
| 3 | 카테고리 선택 후 브랜드 Dropdown 열기 | sleep 없이 바로 brand click | 카테고리 선택 후 최소 1s 대기 필요 | Medium |
| 4 | 브랜드명 | `"nike"` | agent-browser `find text`가 대소문자 구분 → `"Nike"` 여부 확인 필요 | Low |

### scripts/qa/scenarios/admin/auth.sh

- 불일치 없음. 실제 에러 메시지(`이메일 또는 비밀번호가 일치하지 않습니다.`)가 "일치하지" 포함 → `assert_visible_any` 통과.
- 대시보드 `assert_visible "상품 통계"` → Dashboard에 실제 `상품 통계` 섹션 제목 있음 → 통과.

---

## 수정 계획

### 1. product.sh – 라디오 버튼 value 수정 (Critical)

**파일**: `scripts/qa/scenarios/admin/product.sh:75`

```bash
# 현재 (틀림)
ab eval "document.querySelector('input[value=\"판매 대기\"]')?.click()" 2>/dev/null || true

# 수정
ab eval "document.querySelector('input[value=\"pending\"]')?.click()" 2>/dev/null || true
```

### 2. product.sh – Dropdown 트리거 방식 개선 (Medium)

`ab eval querySelector` 방식 → `ab find text` 방식으로 변경. Dropdown의 placeholder 텍스트를 직접 클릭하는 방식이 더 안정적.

```bash
# 현재
ab eval "document.querySelector('[data-testid=\"category\"]')?.click()" 2>/dev/null || true
sleep 1
ab find text "운동화" click 2>/dev/null || true
sleep 1
ab eval "document.querySelector('[data-testid=\"brand\"]')?.click()" 2>/dev/null || true
sleep 1
ab find text "nike" click 2>/dev/null || true

# 수정
ab find text "카테고리를 선택해주세요." click 2>/dev/null || true
sleep 1
ab find text "운동화" click 2>/dev/null || true
sleep 1
ab find text "브랜드를 선택해주세요." click 2>/dev/null || true
sleep 1
ab find text "Nike" click 2>/dev/null || true  # 대소문자 확인 후 적용
```

### 3. product.sh – 브랜드명 대소문자 확인 (Low)

- 앱 테스트 fixture에서는 `"nike"` (소문자) 사용
- agent-browser `find text`가 대소문자 구분하므로 실제 DB 값 확인 필요
- 확인 방법: 브라우저에서 `/products/new` 열어 brand dropdown 내용 캡처

---

## 수정 대상 파일

- `scripts/qa/scenarios/admin/product.sh` — 라디오 값, Dropdown 트리거, 브랜드명
- `scripts/qa/scenarios/admin/auth.sh` — 변경 불필요

---

## 검증 방법

1. 앱 서버 실행 (`pnpm dev` 또는 개발 서버 확인)
2. 개별 시나리오 실행:
   ```bash
   bash scripts/qa/scenarios/admin/auth.sh
   bash scripts/qa/scenarios/admin/product.sh
   ```
3. 또는 전체 admin 시나리오:
   ```bash
   bash scripts/qa/run-scenarios.sh admin
   ```
4. 각 assert 결과에서 `✓` / `✗` 확인

---

## 브랜드명 확인이 필요한 경우

product.sh 수정 전, agent-browser로 `/products/new` 페이지의 brand dropdown 스냅샷을 찍어 실제 값 확인:
```bash
agent-browser --session qa-check open http://localhost:5173/products/new
agent-browser --session qa-check find text "브랜드를 선택해주세요." click
agent-browser --session qa-check snapshot
agent-browser --session qa-check close
```
