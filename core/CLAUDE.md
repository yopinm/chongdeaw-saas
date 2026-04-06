# CLAUDE.md — ChongDeaw Safe Mode Execution Rules

## Mission
You are Claude Code working on ChongDeaw SaaS.
Your job is to complete Phase 1 safely, with minimal changes, strict scope control, and immediate recovery points.

## Safe Mode Priority
Always prefer:
1. Safety
2. Small scope
3. Reversible changes
4. Accurate state tracking
5. Progress speed

If safety conflicts with speed, choose safety.

## Mandatory Read Order
Before any code change, read in this order:
1. `core/SYSTEM_STATE.md`
2. `core/TASK_QUEUE.md`
3. `core/PRD.md`
4. `core/RRD.md`
5. `core/chongdeaw-milestone-driven.md` only if current task needs more context

## Execution Mode
Safe Mode = one task at a time, one commit at a time, one checkpoint at a time.

For each cycle:
1. Read `core/SYSTEM_STATE.md`
2. Find `Next Task`
3. Read only files needed for that task
4. Change the smallest possible set of files
5. Validate the change with the lightest useful check
6. Update `core/SYSTEM_STATE.md`
7. Update `core/TASK_QUEUE.md`
8. Run git add/commit
9. Stop and reassess before continuing

Do not chain many risky edits in one go.

## Scope Control
- Do NOT scan the full repository unless absolutely required
- Do NOT refactor unrelated files
- Do NOT rename folders broadly unless the task explicitly requires it
- Do NOT touch Phase 2+ business features
- Do NOT “clean up” code outside current task
- Do NOT change env files unless the task explicitly needs env wiring

## File Path Rules
All control documents are inside `core/`:
- `core/PRD.md`
- `core/RRD.md`
- `core/SYSTEM_STATE.md`
- `core/TASK_QUEUE.md`
- `core/CLAUDE.md`

Always use these exact paths.

## Pre-Task Git Safety Rule
Before changing code for a task, check working tree status.

If working tree is dirty and changes are unrelated to current task:
- stop
- report it in `core/SYSTEM_STATE.md`
- do not continue automatically

If working tree is clean:
- proceed

## Task Completion Rule
A task is done only when all are true:
- code/files for the task are updated
- no obvious unrelated damage is introduced
- `core/SYSTEM_STATE.md` is updated
- `core/TASK_QUEUE.md` is updated
- a git commit is created

If any item above is false, the task is not done.

## Validation Rule
After each task, run the smallest relevant validation.
Examples:
- config task → type/lint/build check if lightweight
- UI shell task → ensure file structure and imports are valid
- docs/state task → verify links/paths/names are accurate

Do not run heavy repo-wide checks unless required.

## Commit Rules
Use one commit per task.

Commit format:
- `feat(task-XXX): short description`
- `fix(task-XXX): short description`
- `chore(task-XXX): short description`

Never mark a task done without a commit.
Never combine multiple task numbers into one commit.

## Token / Context Safe Stop Rule
If token/context looks tight, stop before starting the next risky edit.

When stopping:
1. finish the current safe checkpoint if possible
2. update `core/SYSTEM_STATE.md`
3. state whether the current task is:
   - DONE
   - PARTIAL
   - BLOCKED
4. describe exact next step
5. do not continue automatically

## Failure Handling Rule
If an error appears:
1. attempt only minimal safe debugging inside current scope
2. if unresolved quickly, stop
3. write blocker and next safe step in `core/SYSTEM_STATE.md`
4. do not improvise broad refactors

## Resume Rule
When resuming after interruption, always:
1. read `core/SYSTEM_STATE.md`
2. trust the latest committed state more than memory
3. continue from `Next Task`
4. if last task was PARTIAL, complete or revert it safely before moving on

## Output Style
Be concise.
Do not explain unrelated theory.
State:
- what task you are doing
- what files you changed
- what validation you ran
- commit message used
- next task

## Suggested Start Command
Use this in Claude Code:

"Run in SAFE MODE. Start from core/SYSTEM_STATE.md. Complete only one task at a time with one commit per task, update state after each task, and stop if context risk or unresolved error appears."
