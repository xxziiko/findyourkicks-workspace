---
description: agent-browser로 변경사항에 대한 QA를 수행합니다
argument-hint: shop | admin | all
---

You are a QA engineer using `agent-browser` CLI to test the application. Your job is to analyze code changes, run relevant test scenarios, and optionally perform exploratory testing.

## Workflow

1. **변경 파일 분석**: Run `git diff --name-only HEAD` to identify changed files.

2. **시나리오 매핑**: Map changes to relevant scenario scripts:
   - `apps/shop/src/features/auth/**` → `scripts/qa/scenarios/shop/auth.sh`
   - `apps/shop/src/features/cart/**` → `scripts/qa/scenarios/shop/cart.sh`
   - `apps/shop/src/features/product/**` or `apps/shop/src/app/**/products/**` → `scripts/qa/scenarios/shop/search.sh`
   - `apps/shop/src/features/review/**` → `scripts/qa/scenarios/shop/review.sh`
   - `apps/shop/src/features/order/**` → `scripts/qa/scenarios/shop/order.sh`
   - `apps/admin/src/features/auth/**` → `scripts/qa/scenarios/admin/auth.sh`
   - `apps/admin/src/features/product/**` → `scripts/qa/scenarios/admin/product.sh`
   - `apps/*/src/shared/**`, `packages/**` → run ALL scenarios
   - If `$ARGUMENTS` is provided, use that instead of diff-based mapping.

3. **시나리오 실행**: Run matched scenarios:
   ```bash
   bash scripts/qa/scenarios/<app>/<scenario>.sh
   ```
   Or run all at once:
   ```bash
   bash scripts/qa/run-scenarios.sh $ARGUMENTS
   ```

4. **탐색적 QA** (optional, after scripted scenarios pass): Use agent-browser directly for exploratory testing of changed areas:
   ```bash
   agent-browser --session qa-explore open <url>
   agent-browser --session qa-explore snapshot -i   # interactive elements
   agent-browser --session qa-explore find role button click --name "..."
   agent-browser --session qa-explore get text <selector>
   agent-browser --session qa-explore screenshot --annotate  # visual verification
   ```

5. **결과 리포트**: Summarize results:
   - `[PASS]` — scenario passed
   - `[FAIL]` — scenario failed with details
   - `[WARN]` — potential issue found during exploratory testing

## Rules

- Dev servers must be running before QA (`pnpm dev:shop` on :3000, `pnpm dev:admin` on :5173).
- Use isolated sessions: `--session qa-<name>` for each test.
- Always close sessions after use: `agent-browser close --session qa-<name>`.
- Use `agent-browser snapshot -i` (interactive only) for cleaner output.
- Do NOT use `waitForNetworkIdle` — use `agent-browser wait <selector>` or `sleep` instead.
- For auth-required pages, use the login flow defined in `scripts/qa/lib.sh`.

## URL 기본값

- Shop: `http://localhost:3000`
- Admin: `http://localhost:5173`
