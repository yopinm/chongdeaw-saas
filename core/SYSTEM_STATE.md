# SYSTEM_STATE.md

## Current Phase
Phase 1 — UAT Entry Stabilization (before Real Integration)

## Execution Mode
SAFE MODE — one task at a time, one commit per task

## Source of Truth Paths
- core/PRD.md
- core/RRD.md
- core/SYSTEM_STATE.md
- core/TASK_QUEUE.md
- core/CLAUDE.md
- core/chongdeaw-milestone-driven.md

## Current Status
TASK-018 complete. Phase 1 security foundation is in place.
However, runtime entry is currently blocked because `localhost:3000` returns 404.
Before starting Real Integration UAT (LINE Auth, Supabase session, JWT claim, RLS), the app must first restore a safe root route and expose a minimal mock Home UI.

## Current Reality Summary
- Phase 1 design baseline exists
- Multi-tenant foundation exists
- TenantContext + store_id isolation exists
- Client-supplied `store_id` rejection exists
- RLS baseline is defined but not yet executed
- Auth is still mock
- Supabase env baseline is ready
- Root route is currently not usable for safe UAT because `/` returns 404

## Immediate Goal
Restore a safe runtime entry and make the app visible again.
Only after that should Real Integration UAT begin.

## Completed Tasks
- TASK-001: DONE — project root and folder structure verified
- TASK-002: DONE — Next.js + TypeScript + Tailwind build passes
- TASK-003: DONE — app/ vs src/ structure confirmed, route tree documented
- TASK-004: DONE — src/components/ created; src/lib/ already present; src/services/ deferred
- TASK-005: DONE — AppShell component created; layout.tsx delegates to it
- TASK-006: DONE — nav items (Home, Queue, Revenue, CRM, Settings) in AppShell; all href="#" placeholder
- TASK-007: DONE — en.json duplicate key fixed; Nav section added to both en.json and th.json
- TASK-008: DONE — LanguageToggle component created; wired in desktop sidebar + mobile top header
- TASK-009: DONE — createClient (browser) + createSupabaseServerClient (server) baseline ready
- TASK-010: DONE — env audit complete; keys documented; .env.local gitignored confirmed
- TASK-011: DONE — auth layout + login page scaffold; /[locale]/login route confirmed in build
- TASK-012: DONE — mock login flow (no LINE API); callback stub at /api/auth/callback (501, documented)
- TASK-013: DONE — Store, Profile, TenantContext, Insert types in src/types/index.ts
- TASK-014: DONE — docs/Multi-tenant DB.sql reconciled: columns aligned, RLS policies stripped to TASK-017
- TASK-015: DONE — getTenantContext() + requireTenantContext() in src/lib/tenant.ts; store_id from DB only
- TASK-016: DONE — assertNoClientStoreId() + stripClientStoreId() + WithoutStoreId<T> in src/lib/validate.ts
- TASK-017: DONE — docs/rls-baseline.sql created; 3 policies defined; 3 limitations + 5-item checklist documented
- TASK-018: DONE — Phase 1 security review complete; foundations confirmed; Phase 2 boundary documented

## Current Task Status
- TASK-019: DONE
- TASK-020: DONE

## In Progress
- None

## Blockers
- None

## Active Risk
- None

## Next Task
TASK-021

## TASK-020 Result
- Status: DONE
- Changed Files: app/[locale]/page.tsx (1 edit — added MOCK UI badge)
- Validation: `npm run build` — TypeScript clean, all 5 routes present
- Commit: feat(task-020): add MOCK UI badge to home page hero section
- What exists (was already in baseline):
  - 6 cards: สั่งกาแฟ, รายการคิว, รายได้ร้าน, ดูสต๊อก-สั่งของ, ติดตามลูกค้า, ตั้งค่าระบบ
  - Mobile-first card grid (2-col mobile, 3-col tablet, 6-col desktop)
  - Mock stats panel (18 orders, 5 queue, ฿2,480) — all hardcoded placeholder
  - i18n via useTranslations — TH/EN both work
  - All hrefs are "#" — no real routing yet
- What was added: "MOCK UI" pill badge next to greeting text in hero section
- No TenantContext, no auth, no Supabase, no middleware touched

## TASK-019 Result
- Status: DONE
- Changed Files: app/page.tsx (created)
- Root cause: app/page.tsx did not exist — App Router had no page to serve at /
- Fix: added redirect("/th") as a static fallback (next-intl middleware also redirects, page is dual safety)
- Validation: `npm run build` — `/` now appears as ○ (Static) in route output; TypeScript clean
- Commit: fix(task-019): add root page redirect to /th, fix localhost:3000 404
- Before: build output had no `/` route → 404
- After: `○ /` present, redirects to `/th`

## TASK-019 Definition
Restore root route and remove localhost:3000 404 safely.

### Requirements
- `localhost:3000` must not return 404
- If project uses locale routing, root `/` should safely redirect to default locale such as `/th`
- If redirect is risky, render a minimal safe placeholder at `/`
- Make the smallest possible change set
- Do not refactor unrelated files
- Do not start real auth/session work yet

### Validation
- Opening `/` no longer returns 404
- Opening `/th` renders safely or confirms the intended default locale path works
- No business logic changes introduced

### Exit Condition
TASK-019 is DONE only when the runtime entry is restored and safe to continue.

## Next Safe Sequence After TASK-019
- TASK-020: Add minimal mock Home UI using existing layout shell
- TASK-021: Review and align auth entry points for Phase 1 UAT
- TASK-022: Integrate real LINE Auth with Supabase session in safe mode
- TASK-023: Bind real session to TenantContext server-side
- TASK-024: Inject `store_id` or `active_store_id` into JWT in additive mode
- TASK-025: Enable RLS incrementally on low-risk tables first
- TASK-026: Execute end-to-end tenant isolation UAT
- TASK-027: Update core documents to reflect real UAT state
- TASK-028: Write Phase 1 UAT readiness / pass-fail note

## Runtime Clue for 404 Investigation
Claude should check these in minimal scope order:
1. Is there a root route file at `app/page.tsx` or `src/app/page.tsx`?
2. Is the project using locale routes such as `app/[locale]/page.tsx` or `src/app/[locale]/page.tsx`?
3. If locale routes exist, is root `/` missing a redirect?
4. Is there a layout/path mismatch causing root to hit not-found?
5. Is a route group structure hiding the intended home entry?

## Last Safe Baseline
Security foundation is complete through TASK-018.
Create a fresh git safety checkpoint before touching runtime routing.

## Safe Mode Working Rules
- Execute only one task at a time
- Update this file after every task
- Record task result as DONE, PARTIAL, or BLOCKED
- Record changed files
- Record light validation performed
- Record commit message used
- If token/context risk increases, stop before starting the next task

## Resume Rule
When resuming, Claude must:
1. read this file first
2. verify current task status
3. trust committed state over memory
4. continue only from `Next Task`

## Safe Stop Template
When stopping, append a short note with:
- Task: TASK-XXX
- Status: DONE / PARTIAL / BLOCKED
- Changed Files:
- Validation:
- Commit:
- Next Safe Step:
