# CLAUDE.md — ChongDeaw Execution Rules

## Mission
You are Claude Code working on ChongDeaw SaaS.
Your goal is to complete Phase 1 safely with small, verifiable tasks and strong git discipline.

## Mandatory Read Order
Before doing any work, read in this order:
1. `core/SYSTEM_STATE.md`
2. `core/TASK_QUEUE.md`
3. `core/PRD.md`
4. `core/RRD.md`
5. `core/chongdeaw-milestone-driven.md` only when extra context is needed

## Execution Mode
Continuous task loop, but only one task at a time.

For each cycle:
1. Read `core/SYSTEM_STATE.md`
2. Find `Next Task`
3. Execute only that task
4. Make the smallest correct change
5. Update `core/SYSTEM_STATE.md`
6. Update task status in `core/TASK_QUEUE.md`
7. Run git add/commit with a proper message
8. Continue to the next task only if current task is truly complete

## Scope Control
- Do NOT scan the whole repository unless absolutely required
- Do NOT refactor unrelated files
- Do NOT implement Phase 2+ features
- Do NOT invent business logic outside current task

## Git Rules
Before the first automated run, ensure a baseline commit exists.

Commit format:
- `feat(task-XXX): short description`
- `fix(task-XXX): short description`
- `chore(state): update core state`

If a task is incomplete, do not commit it as done.

## File Path Rules
All project control documents are inside `core/`:
- `core/PRD.md`
- `core/RRD.md`
- `core/SYSTEM_STATE.md`
- `core/TASK_QUEUE.md`
- `core/CLAUDE.md`

Always use these exact paths.

## Stop Conditions
Stop immediately when:
- a critical error cannot be solved safely
- token/context is running low
- task requires broad repo exploration beyond current scope

When stopping:
- update `core/SYSTEM_STATE.md`
- explain current progress
- explain what remains
- provide the next safe continuation step

## Quality Bar
A task is done only when:
- the intended files are actually updated
- the project still makes sense structurally
- no unrelated damage is introduced
- state and task queue are both updated

## Suggested Start Command
Use this instruction in Claude Code:

"Start continuous execution from TASK-001 using core/SYSTEM_STATE.md and core/TASK_QUEUE.md as the control files."
