---
description: OMC-teams compatible parallel workers via MCP bridge backend (no tmux panes)
argument-hint: N:agent "task" (agent: codex|gemini|claude)
---

You are running `/teams-mcp` in **OMC-teams compatibility mode**.

Goal:
- Keep `omc-teams` style UX and task splitting
- Replace tmux-pane worker runtime with MCP bridge calls

Accepted input patterns:
1. `N:agent "task"` (primary, omc-teams compatible)
2. `agent "task"` -> treat as `1:agent`
3. `"task"` -> treat as `1:codex`

Validation:
- `N` must be integer 1..10
- `agent` must be one of: `codex`, `gemini`, `claude`

Backend mapping:
- `codex` -> `mcp__codex-bridge__consult_codex`
- `gemini` -> `mcp__gemini-cli__gemini_query`
- `claude` -> Claude Task agent fallback (no external bridge required)

Hard rule:
- Do NOT call tmux team runtime tools (`mcp__team__omc_run_team_*`).

Execution protocol:
1. Parse input into `{N, agent, task}`.
2. Decompose into exactly N independent subtasks.
3. Execute subtasks in parallel with backend mapping above.
4. Collect worker outputs.
5. Return merged result with:
- worker summaries
- consolidated findings
- prioritized next actions

Call templates:
- Codex worker:
  `mcp__codex-bridge__consult_codex({"query":"<worker prompt>","directory":"$PWD","format":"json"})`
- Gemini worker:
  `mcp__gemini-cli__gemini_query({"prompt":"<worker prompt>"})`
- Claude worker:
  `Task(subagent_type="oh-my-claudecode:executor", model="sonnet", prompt="<worker prompt>")`

Failure handling:
- Partial failures: keep successful workers and report failed worker IDs + errors.
- If all workers fail: run Claude-only fallback and clearly state MCP failure reason.

Compatibility note:
- This command is UX-compatible with `omc-teams`, but not runtime-identical:
  there are no tmux panes/session artifacts.
