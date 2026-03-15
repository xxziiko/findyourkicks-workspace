# Conductor + OMC 멀티모델(MCP 우회) 설정 가이드

목표:
- Conductor 앱에서 `tmux pane` 의존 없이 OMC 멀티모델(Codex/Gemini) 사용
- 다른 Mac에서도 동일하게 재현 가능하도록 순서화
- 누락/오작동 지점을 빠르게 점검 가능

## 0) 현재 환경에서 확인된 상태 (기준값)

아래 값이 현재 기준으로 확인됨:

- OMC 플러그인: `oh-my-claudecode@omc` `4.5.2`
- 플러그인 경로: `/Users/kwonjiho/.claude/plugins/cache/omc/oh-my-claudecode/4.5.2`
- Claude 설정: `~/.claude/settings.json`
- 활성 플러그인: `oh-my-claudecode@omc: true`
- Agent Teams 플래그: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- MCP 서버 상태:
  - `plugin:oh-my-claudecode:t` ✅
  - `plugin:oh-my-claudecode:team` ✅
  - `codex-bridge` ✅
  - `gemini-cli` ✅
- 바이너리:
  - `codex-cli 0.106.0`
  - `gemini 0.4.0`
  - `tmux 3.6a`

검증 커맨드:

```bash
claude mcp list
claude mcp get codex-bridge
claude mcp get gemini-cli
which codex gemini tmux
codex --version
gemini --version
tmux -V
```

## 1) 반드시 이해할 점 (핵심)

- OMC 기본 `/ccg`, `/omc-teams`는 tmux 런타임 기반이다.
- Conductor 환경에서는 tmux 세션/패인 제약으로 실패 가능성이 높다.
- 따라서 멀티모델 호출은 반드시 MCP 브리지 기반 스킬/커맨드로 우회해야 한다.

우회 대상:
- Codex: `mcp__codex-bridge__consult_codex`
- Gemini: `mcp__gemini-cli__gemini_query`

금지 대상(우회 누락 포인트):
- `mcp__team__omc_run_team_*` (tmux 팀 런타임)

## 2) 다른 컴퓨터에서 재현 설치 순서

### 2-1. 기본 도구 설치

```bash
# Node / npm / pnpm (환경에 맞게)
node -v
npm -v

# Codex CLI
npm i -g @openai/codex

# Gemini CLI
npm i -g @google/gemini-cli

# tmux (백업 용도)
brew install tmux
```

### 2-2. Claude + OMC 플러그인 준비

1. Claude Code 로그인 완료
2. OMC 플러그인 설치/활성화
3. `~/.claude/settings.json` 확인

확인 포인트:
- `enabledPlugins.oh-my-claudecode@omc = true`
- `env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = "1"`

### 2-3. MCP 브리지 등록

현재 기준 브리지는 사용자 스코프(user)에 등록되어야 함.

```bash
claude mcp add codex-bridge -s user -- /Users/<you>/.local/share/mcp-bridges/codex-bridge/.venv/bin/codex-bridge
claude mcp add gemini-cli -s user -- node /Users/<you>/.local/share/mcp-bridges/gemini-cli-mcp/dist/index.js
```

주의:
- 경로는 설치 위치에 맞게 바꿔야 함.
- 등록 후 반드시 상태 확인:

```bash
claude mcp list
claude mcp get codex-bridge
claude mcp get gemini-cli
```

### 2-4. 프로젝트 우회 커맨드 반영

프로젝트 루트의 커맨드 파일(워크스페이스 로컬):
- `.claude/commands/ccg-mcp.md`
- `.claude/commands/teams-mcp.md`

역할:
- `ccg-mcp`: tri-model(Codex + Gemini + Claude 합성), tmux 금지
- `teams-mcp`: `N:agent "task"` 형식 병렬 실행, tmux 금지

이 두 파일을 프로젝트에 포함(버전관리)하면 팀/다른 PC에서도 동일 동작을 강제할 수 있음.

### 2-5. Codex 타임아웃 설정(권장)

긴 프롬프트에서 Codex가 파일 탐색으로 90초 이상 걸릴 수 있음.

```bash
# ~/.zshrc
export CODEX_TIMEOUT=300
```

또는 호출 파라미터에 `timeout: 300` 명시.

## 3) 우회 누락 점검 체크리스트

아래 6개를 모두 만족하면 정상:

1. `claude mcp list`에서 `codex-bridge`, `gemini-cli`가 모두 `Connected`
2. `/ccg-mcp` 실행 시 `mcp__codex-bridge__consult_codex` + `mcp__gemini-cli__gemini_query` 호출
3. `/teams-mcp` 실행 시 `mcp__team__omc_run_team_*` 호출이 없어야 함
4. 결과가 "tmux pane/session" 생성 없이 반환되어야 함
5. Codex timeout 시 재시도 또는 Claude fallback 동작
6. OMC 기본 `/ccg`, `/omc-teams`를 멀티모델 진입점으로 쓰지 않음 (tmux 경로)

## 4) 실제 운영 권장 규칙

- 멀티모델 작업 기본 명령은 `/ccg-mcp`로 통일
- 팀 분할 작업은 `/teams-mcp N:codex|gemini "..."` 사용
- `/ccg`, `/omc-teams`는 Conductor 환경에서는 비권장(또는 금지)

## 5) 빠른 스모크 테스트

```bash
# 1) MCP 연결 확인
claude mcp list

# 2) CCG-MCP 단건 테스트
# (Claude 대화에서)
# /ccg-mcp 현재 프로젝트의 인증 모듈 보안 + 로그인 UX 개선안 병렬 검토

# 3) Teams-MCP 테스트
# /teams-mcp 2:codex "auth security review"
# /teams-mcp 2:gemini "login UX alternatives"
```

성공 기준:
- tmux 관련 에러 없이 결과 반환
- worker 결과 + 통합 요약 포함

## 6) 트러블슈팅

### 증상 A: `codex-bridge` 연결 실패
- 조치:
  - 브리지 바이너리 경로 재확인
  - venv 손상 시 재설치
  - `claude mcp remove/add`로 재등록

### 증상 B: `gemini-cli` 연결 실패
- 조치:
  - `node` 경로 확인
  - `gemini-cli-mcp/dist/index.js` 경로 확인
  - `claude mcp remove/add` 재등록

### 증상 C: 여전히 tmux 호출
- 원인:
  - `/ccg` 또는 `/omc-teams` 경로를 타고 있음
  - 커맨드 라우팅이 `ccg-mcp`가 아닌 기본 skill로 연결됨
- 조치:
  - 멀티모델 트리거를 `/ccg-mcp`로 강제
  - `.claude/commands/ccg-mcp.md`, `.claude/commands/teams-mcp.md` 존재/최신화 확인

### 증상 D: Codex timeout
- 조치:
  - `timeout: 300` 명시
  - 디렉터리 범위를 repo root -> 하위 모듈로 축소
  - 프롬프트 분할

## 7) 백업/복제 대상 파일 목록

다른 컴퓨터에 복제할 때 핵심 파일:

- `~/.claude/settings.json`
- `~/.claude/.omc-config.json` (선택)
- 프로젝트별 `.claude/commands/ccg-mcp.md`
- 프로젝트별 `.claude/commands/teams-mcp.md`

참고:
- MCP 브리지 실행 경로는 PC마다 달라질 수 있으므로, 경로 하드코딩은 그대로 복사하지 말고 `claude mcp get <name>` 결과 기준으로 재등록 권장.
