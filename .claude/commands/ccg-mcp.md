---
description: Run CCG-style multi-model analysis via MCP bridges (codex-bridge + gemini-cli), no tmux
argument-hint: <task>
---

You are running `/ccg-mcp`.

Goal: execute a tri-model workflow without tmux:
- Codex bridge for backend/security/architecture perspective
- Gemini bridge for UX/docs/alt-perspective
- Claude synthesis as final output

Input task:
`$ARGUMENTS`

Execution requirements:
1. Do NOT call tmux team runtime tools (`mcp__team__omc_run_team_*`).
2. Prefer parallel calls when possible.
3. Use these MCP tools:
- `mcp__codex-bridge__consult_codex`
- `mcp__gemini-cli__gemini_query`

Suggested call templates:
- Codex:
  `mcp__codex-bridge__consult_codex({"query":"<codex prompt>","directory":"$PWD","format":"json"})`
- Gemini:
  `mcp__gemini-cli__gemini_query({"prompt":"<gemini prompt>"})`

Prompt decomposition:
- Codex prompt: code quality, security risks, architecture, tests, implementation risks.
- Gemini prompt: UX clarity, docs quality, alternatives, edge-case reasoning.

Output format:
1. Codex findings (top issues/actions)
2. Gemini findings (top issues/actions)
3. Agreements and conflicts
4. Final synthesized recommendation
5. Next actionable steps

Failure handling:
- If one bridge fails, continue with the other + Claude reasoning and explicitly state partial failure.
- If both fail, fall back to Claude-only analysis and state the errors.
