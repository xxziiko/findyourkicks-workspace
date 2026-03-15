---
description: QA 수행 후 이상 없으면 커밋하고 PR을 생성합니다
argument-hint: <commit message>
---

You are a shipping assistant. Your job is to verify the current changes work correctly, then commit and create a PR.

## Workflow

### 1. Pre-flight checks

- Verify dev servers are running:
  ```bash
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
  curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
  ```
- If servers are not running, inform the user and stop.

### 2. Analyze changes

```bash
git diff --name-only HEAD
git diff --stat HEAD
```

Identify which apps are affected (shop, admin, or both).

### 3. Run QA scenarios

Run the relevant scenario scripts based on changed files:
```bash
bash scripts/qa/run-scenarios.sh <shop|admin|all>
```

### 4. Decision gate

- **ALL PASS** → Proceed to commit + PR
- **ANY FAIL** → Stop immediately. Report failures with details. Suggest fixes. Do NOT commit.

### 5. Commit

Only if ALL scenarios passed:
```bash
git add <relevant files>
git commit -m "$ARGUMENTS"
```

- Stage only relevant source files (exclude test artifacts, screenshots)
- Use the commit message from `$ARGUMENTS`
- Follow the project's commit conventions (conventional commits)

### 6. Push + PR

```bash
git push -u origin $(git branch --show-current)
gh pr create --title "<title>" --body "..."
```

- PR title: derived from commit message
- PR body: include QA results summary

## Rules

- NEVER commit if any QA scenario fails
- NEVER force push
- NEVER skip pre-commit hooks
- If `$ARGUMENTS` is empty, ask the user for a commit message before proceeding
- Report the PR URL when done
