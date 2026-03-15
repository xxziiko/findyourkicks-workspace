---
description: 코드베이스를 분석하고 기능 명세서를 생성합니다
argument-hint: <기능 설명 또는 요구사항>
---

이 턴의 산출물은 `.specs/<feature-name>/` 디렉토리에 생성되는 **명세 파일 3개**다.
프로덕션 코드는 절대 건드리지 않는다.

## 입력

`$ARGUMENTS` — 기능 설명, 버그 리포트, 또는 변경 요구사항.

## 산출물

`.specs/<feature-name>/` 디렉토리에 3개 파일:

### 1. `requirements.md`
```markdown
# [기능명] 요구사항

## 개요
- 왜 이 기능이 필요한지
- 현재 상태 (관련 파일/함수 참조)

## 요구사항
### REQ-1: [제목]
- **Given** [사전 조건]
- **When** [행동]
- **Then** [기대 결과]

### REQ-2: ...

## Open Questions
- [모호한 점이 있으면 여기에 질문]
```

### 2. `design.md`
```markdown
# [기능명] 설계

## 대상 앱
shop | admin | shared | multiple

## 영향받는 파일
- `path/to/file.ts` — 변경 내용

## 데이터 흐름
- API → Hook → Component 흐름 설명

## 의존성
- 기존 유틸/컴포넌트 재사용 목록
```

### 3. `tasks.md`
```markdown
# [기능명] 구현 태스크

## Task 1: [제목]
- 유형: unit-test | e2e-test | implementation
- 대상: [파일 경로]
- 설명: [구체적 구현 내용]

## Task 2: ...
```

## 프로세스

1. `$ARGUMENTS`를 읽고 기능 범위를 파악한다.
2. 코드베이스를 탐색하여 현재 상태를 파악한다 — 관련 파일, 타입, API, 훅을 찾는다.
3. `SPEC.md`를 참조하여 프로젝트 전체 요구사항과의 정합성을 확인한다.
4. 모호한 점이 있으면 `requirements.md`의 Open Questions에 기재하고 사용자에게 질문한다.
5. `.specs/<feature-name>/` 디렉토리를 생성하고 3개 파일을 작성한다.

## 규칙

- 파일 생성은 `.specs/` 디렉토리 안에서만 한다.
- 프로덕션 코드, 테스트 코드를 생성하거나 수정하지 않는다.
- 코드베이스 분석을 생략하지 않는다 — 항상 현재 상태를 확인 후 명세를 작성한다.
- tasks.md의 각 태스크는 `/red` 단계에서 테스트로 변환될 수 있을 만큼 구체적이어야 한다.
