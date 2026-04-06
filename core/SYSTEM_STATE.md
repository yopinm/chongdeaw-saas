# SYSTEM_STATE.md

## Current Phase
Phase 1 — SaaS Foundation

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
TASK-018 complete. Phase 1 security review done — foundations in place, mock items catalogued, clear Phase 2 boundary set.

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
- TASK-018: DONE

## In Progress
- None

## Blockers
- None confirmed

## Next Task
TASK-019

## TASK-001 Result
- Status: DONE
- Changed Files: core/SYSTEM_STATE.md, core/TASK_QUEUE.md
- Validation: Listed all files in app/ and src/, confirmed deps in package.json
- Commit: chore(task-001): verify project root structure for Phase 1
- Findings:
  - app/[locale]/ with (auth)/, (dashboard)/, (store)/ groups — all empty
  - app/admin/ — empty
  - src/lib/supabase.ts, src/i18n/request.ts, src/middleware.ts, src/messages/en.json + th.json
  - Dependencies: next, react, @supabase/ssr, @supabase/supabase-js, next-intl
  - Missing: src/components/, src/services/ (Phase 1 needs, handled in TASK-004)
  - Dual-root structure confirmed: app/ = routes, src/ = utilities/i18n/supabase
- Next Safe Step: TASK-002 — verify Next.js + TypeScript + Tailwind setup is working

## Last Safe Baseline
Confirmed baseline commit exists before safe mode run.
If more manual edits are made before running Claude again, create a new safety commit first.

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

## TASK-002 Result
- Status: DONE
- Changed Files: core/SYSTEM_STATE.md, core/TASK_QUEUE.md
- Validation: `npm run build` — succeeded, TypeScript clean, static pages generated
- Commit: chore(task-002): verify Next.js + TypeScript + Tailwind build
- Findings:
  - Next.js 16.2.2 with Turbopack ✓
  - TypeScript strict mode, no errors ✓
  - Tailwind v4 via @tailwindcss/postcss (`@import "tailwindcss"` in globals.css) ✓
  - next-intl integrated and routing working ✓
  - Build output: /[locale] dynamic route, /_not-found static ✓
- Next Safe Step: TASK-003 — confirm app/ vs src/ route structure, reduce ambiguity

## TASK-003 Result
- Status: DONE
- Changed Files: core/SYSTEM_STATE.md, core/TASK_QUEUE.md (docs only)
- Validation: No code changes — build already confirmed in TASK-002
- Commit: chore(task-003): confirm app/ vs src/ route structure
- Findings:
  - app/ = App Router (routing layer): layout.tsx, [locale]/layout.tsx, [locale]/page.tsx
  - src/ = utilities/config: middleware.ts, i18n/request.ts, lib/supabase.ts, messages/
  - Route groups confirmed: (auth)/, (dashboard)/, (store)/ all empty, ready for Phase 1
  - @/* alias maps to ./ (root) in tsconfig but currently unused — all imports are relative
  - KNOWN ISSUE: en.json has duplicate "settings" key — first entry silently overridden → fix in TASK-007
- Next Safe Step: TASK-004 — create src/components/, src/services/ for Phase 1 use

## TASK-004 Result
- Status: DONE
- Changed Files: src/components/.gitkeep (created)
- Validation: `npm run build` — still passes after folder addition
- Commit: chore(task-004): add src/components/ foundation folder
- Decisions:
  - src/components/ created — needed by TASK-005/006/008 (layout shell, nav, language toggle)
  - src/lib/ already exists — no action needed
  - src/services/ deferred — no Phase 1 task needs it before TASK-013+
- Next Safe Step: TASK-005 — create/adjust global layout shell (mobile-first)

## TASK-005 Result
- Status: DONE
- Changed Files: src/components/AppShell.tsx (created), app/[locale]/layout.tsx (thinned)
- Validation: `npm run build` — TypeScript clean, build passes
- Commit: feat(task-005): extract AppShell component, thin locale layout
- Decisions:
  - AppShell owns the layout structure (sidebar + main + mobile bottom nav)
  - layout.tsx now only handles i18n provider + AppShell — no inline HTML
  - Nav containers are empty placeholders — TASK-006 fills them in
- Next Safe Step: TASK-006 — add Home, Queue, Revenue, CRM, Settings nav items

## TASK-006 Result
- Status: DONE
- Changed Files: src/components/AppShell.tsx (nav items added)
- Validation: `npm run build` — TypeScript clean, build passes
- Commit: feat(task-006): add Home/Queue/Revenue/CRM/Settings nav to AppShell
- Decisions:
  - navItems array drives both desktop sidebar and mobile bottom nav (single source of truth)
  - Labels: English for desktop, Thai for mobile bottom nav
  - All href="#" — real routes wired when pages are scaffolded (TASK-011+)
  - Mobile shows Thai labels; desktop shows English — can be unified with i18n in TASK-008
- Next Safe Step: TASK-007 — baseline i18n for TH/EN; fix en.json duplicate "settings" key

## TASK-007 Result
- Status: DONE
- Changed Files: src/messages/en.json, src/messages/th.json
- Validation: `npm run build` — passes, TypeScript clean
- Commit: fix(task-007): fix en.json duplicate key, add Nav i18n section
- Changes:
  - en.json: removed duplicate "settings" key under Home.menu
  - Both files: added "Nav" section with keys home/queue/revenue/crm/settings
  - en.json Nav: Home, Queue, Revenue, CRM, Settings
  - th.json Nav: หน้าหลัก, คิว, รายได้, ลูกค้า, ตั้งค่า
- Next Safe Step: TASK-008 — add language toggle to layout shell

## TASK-008 Result
- Status: DONE
- Changed Files: src/components/LanguageToggle.tsx (created), src/components/AppShell.tsx (toggle added)
- Validation: `npm run build` — TypeScript clean, build passes
- Commit: feat(task-008): add LanguageToggle to AppShell
- Decisions:
  - LanguageToggle is "use client" — uses useParams + usePathname to swap locale prefix in path
  - Desktop: toggle at bottom of sidebar (below nav items)
  - Mobile: toggle in sticky top header alongside brand name
  - Shows target locale (e.g. if current is TH, shows "EN" to switch to)
- Next Safe Step: TASK-009 — verify/baseline Supabase client without forcing unready logic

## TASK-009 Result
- Status: DONE
- Changed Files: src/lib/supabase.ts
- Validation: `npm run build` — TypeScript clean, build passes
- Commit: feat(task-009): add Supabase server client baseline
- Changes:
  - Kept existing createClient() (browser, for Client Components)
  - Added createSupabaseServerClient() (server, async, uses cookies() from next/headers)
  - No routes or components wired to these clients yet — auth binding comes in TASK-015+
  - Both clients require NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
- Next Safe Step: TASK-010 — check env wiring, document what's missing

## TASK-010 Result
- Status: DONE
- Changed Files: core/SYSTEM_STATE.md, core/TASK_QUEUE.md (docs only — no code changes)
- Validation: env keys confirmed present; .gitignore confirmed protecting .env.local; build still passes
- Commit: chore(task-010): env wiring audit — Supabase present, LINE missing

### Env Audit Summary

| Var | Status | Used By |
|-----|--------|---------|
| NEXT_PUBLIC_SUPABASE_URL | SET (41 chars) | src/lib/supabase.ts |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | SET | src/lib/supabase.ts |
| LINE_CHANNEL_ID | MISSING | TASK-012 (LINE login) |
| LINE_CHANNEL_SECRET | MISSING | TASK-012 (LINE login) |
| SUPABASE_SERVICE_ROLE_KEY | MISSING | TASK-017 (RLS admin ops, can defer to Phase 2) |

### Notes
- .env.local is gitignored via `.env*` rule — safe
- Supabase wiring is ready for TASK-011+ (auth scaffold)
- LINE keys must be added before TASK-012 can be made real (mock flow acceptable as placeholder)
- SUPABASE_SERVICE_ROLE_KEY is not needed until RLS admin operations — safe to defer

- Next Safe Step: TASK-011 — scaffold login entry and auth entry points

## TASK-011 Result
- Status: DONE
- Changed Files:
  - app/[locale]/(auth)/layout.tsx (created) — centered auth layout, no AppShell
  - app/[locale]/(auth)/login/page.tsx (created) — login page scaffold, disabled LINE button
- Validation: `npm run build` — /[locale]/login route appears in build output, TypeScript clean
- Commit: feat(task-011): scaffold auth layout and login page
- Decisions:
  - Auth layout is separate from AppShell — no sidebar/nav for login flow
  - LINE button is disabled + labeled "scaffold only, wired in TASK-012"
  - No auth logic, no DB calls, no session handling — scaffold only
  - Callback route deferred to TASK-012 (LINE login integration)
- Next Safe Step: TASK-012 — LINE login integration point or mock flow

## TASK-012 Result
- Status: DONE
- Changed Files:
  - app/[locale]/(auth)/login/page.tsx (updated) — now "use client", mock login with 800ms delay + redirect
  - app/api/auth/callback/route.ts (created) — stub GET handler, returns 501 with full comment
- Validation: `npm run build` — /[locale]/login + /api/auth/callback both in build output, TypeScript clean
- Commit: feat(task-012): LINE login mock flow + callback stub
- What is MOCK (not real):
  - No LINE OAuth URL is built — button just redirects to /{locale} after delay
  - No code/token exchange — no LINE API calls
  - No session is created — redirect has no cookie/auth state
  - Callback route returns 501 — no real logic
- What is REAL (structure ready):
  - Callback path /api/auth/callback is registered (correct location for LINE redirect URL)
  - Comment in route.ts describes full real flow step-by-step
  - Required env vars listed in comment (LINE_CHANNEL_ID, LINE_CHANNEL_SECRET)
- Next Safe Step: TASK-013 — tenant/profile/store contracts in code

## TASK-013 Result
- Status: DONE
- Changed Files: src/types/index.ts (created)
- Validation: `npm run build` — TypeScript clean, all routes still present
- Commit: feat(task-013): define Store, Profile, TenantContext type contracts
- Contracts defined:
  - UserRole = "owner" | "staff"
  - Locale = "th" | "en"
  - Store — id, name, owner_id, line_channel_id, locale, created_at
  - Profile — id, store_id, line_user_id, display_name, picture_url, role, created_at
  - TenantContext — user_id, store_id, role (server-resolved, never from client)
  - StoreInsert / ProfileInsert — Omit<..., "id" | "created_at"> for DB writes
- What is NOT done (by design):
  - No DB migration — TASK-014
  - No RLS policies — TASK-017
  - No session binding — TASK-015
- Next Safe Step: TASK-014 — schema baseline summary for stores + profiles

## TASK-014 Result
- Status: DONE
- Changed Files: docs/Multi-tenant DB.sql (reconciled — was early draft, now aligned with TASK-013 types)
- Validation: `npm run build` — still passes (SQL is reference only, not runtime)
- Commit: chore(task-014): reconcile schema baseline with TASK-013 type contracts
- Reconciliation summary:
  - stores: added owner_id, line_channel_id, locale; renamed name_th → name; kept slug/subscription_status/tenant_tier
  - profiles: added line_user_id, display_name, picture_url; role lowercase (owner/staff); dropped ADMIN
  - RLS: ENABLE ROW LEVEL SECURITY kept; policies stripped and moved to TASK-017 comment block
- Delta (DB fields not yet in TypeScript types — add before using in code):
  - stores: slug, subscription_status, tenant_tier
  - profiles: is_deleted
- Next Safe Step: TASK-015 — define how store_id binds to auth/session context

## TASK-015 Result
- Status: DONE
- Changed Files: src/lib/tenant.ts (created)
- Validation: `npm run build` — TypeScript clean, all routes unchanged
- Commit: feat(task-015): define store_id binding flow in getTenantContext()
- Design:
  - getTenantContext() → TenantContext | null
    1. createSupabaseServerClient() (cookies-based, server-side only)
    2. supabase.auth.getUser() (verifies JWT — trusted)
    3. SELECT store_id, role FROM profiles WHERE id = user.id AND is_deleted = false
    4. Return { user_id, store_id, role } — store_id from DB, never from caller
  - requireTenantContext() → TenantContext | throws
    - Wraps getTenantContext(), throws if null (TODO: replace with redirect)
  - ProfileRow internal type used for safe DB result casting
- Limitations documented in file header:
  - Prerequisite A: profiles table must exist (run docs/Multi-tenant DB.sql)
  - Prerequisite B: real Supabase session needed (mock login does not create one)
  - Prerequisite C: JWT claim binding in TASK-016+
- Next Safe Step: TASK-016 — request validation layer that refuses frontend store_id

## TASK-016 Result
- Status: DONE
- Changed Files: src/lib/validate.ts (created)
- Validation: `npm run build` — TypeScript clean, all routes unchanged
- Commit: feat(task-016): add request validation layer rejecting client store_id
- What was added:
  - WithoutStoreId<T> — Omit<T, "store_id"> utility type
  - assertNoClientStoreId(input, source?) — throws SECURITY error if body has store_id
  - stripClientStoreId<T>(input) — silently removes store_id, returns WithoutStoreId<T>
  - Usage pattern comment in file header showing the full Route Handler pattern
- Enforcement contract:
  - Hard path: assertNoClientStoreId() at every API boundary (Route Handlers, Server Actions)
  - Soft path: stripClientStoreId() for internal data-shaping
  - store_id always from requireTenantContext() — never from the caller
- Next Safe Step: TASK-017 — RLS baseline scaffold + limitation notes

## TASK-017 Result
- Status: DONE
- Changed Files: docs/rls-baseline.sql (created)
- Validation: `npm run build` — passes, SQL file has no runtime impact
- Commit: chore(task-017): scaffold RLS policy baseline with limitation checklist
- Policies defined (NOT YET EXECUTED):
  - stores_owner_access: FOR ALL USING (owner_id = auth.uid())
  - profiles_tenant_isolation: FOR ALL USING (store_id = jwt.user_metadata.store_id AND is_deleted = false)
  - profiles_self_rw: FOR ALL USING (id = auth.uid())
- 5-item prerequisite checklist in file header (must ALL be met before executing)
- 3 documented limitations (A/B/C):
  - A: Mock login creates no session → auth.uid() returns nothing
  - B: store_id not yet written to JWT user_metadata at login time
  - C: SUPABASE_SERVICE_ROLE_KEY missing — admin writes not yet possible
- Phase 2 expansion pattern documented (tenant_isolation + owner_write templates)
- Next Safe Step: TASK-018 — review Phase 1 security baseline

## TASK-018 Result — Phase 1 Security Baseline Review
- Status: DONE
- Changed Files: core/SYSTEM_STATE.md, core/TASK_QUEUE.md (docs only — no code changes)
- Validation: reviewed src/lib/tenant.ts, src/lib/validate.ts, src/middleware.ts, src/lib/supabase.ts,
              src/types/index.ts, docs/rls-baseline.sql, docs/Multi-tenant DB.sql
- Commit: chore(task-018): Phase 1 security baseline review

### FOUNDATIONS COMPLETE (structure enforced in code)

| Area | File | Status |
|---|---|---|
| store_id never from client | src/lib/tenant.ts | ✓ getTenantContext() reads from DB via verified user.id |
| Request validation | src/lib/validate.ts | ✓ assertNoClientStoreId() throws; stripClientStoreId() strips |
| Type contracts | src/types/index.ts | ✓ TenantContext, Store, Profile, UserRole |
| Schema baseline | docs/Multi-tenant DB.sql | ✓ aligned with TS types; RLS ENABLE declared |
| RLS policies | docs/rls-baseline.sql | ✓ defined with prerequisite checklist; not yet executed |
| Supabase clients | src/lib/supabase.ts | ✓ browser + server (cookies-based) |
| Auth scaffold | app/[locale]/(auth)/ | ✓ login page + callback at correct static path |
| Env protection | .gitignore | ✓ .env* excluded; vars documented |
| i18n middleware | src/middleware.ts | ✓ locale routing; auth redirect noted as TODO |

### MOCK / NOT YET OPERATIONAL (clearly labeled throughout codebase)

| Item | Status | Unblocked By |
|---|---|---|
| LINE OAuth callback | 501 STUB | LINE_CHANNEL_ID + LINE_CHANNEL_SECRET in .env.local |
| Real Supabase session | None exists | Real LINE callback implementation |
| JWT user_metadata.store_id | Not set | Real callback + Supabase auth.admin.updateUserById |
| profiles table in Supabase | Not created | Run docs/Multi-tenant DB.sql |
| RLS policies executed | Not run | 5-item checklist in docs/rls-baseline.sql |
| SUPABASE_SERVICE_ROLE_KEY | Missing | Manual .env.local addition |
| Middleware auth redirect | i18n only | After real session exists |

### PHASE 1 VERDICT
- Security LAYER is phase-complete: all patterns enforced in code, all stubs clearly labeled
- Phase 1 is NOT yet finished: TASK-019 through 024 remain (PWA, dashboard, integration, docs, readiness)
- Safe to proceed to TASK-019
- Mock parts are Phase 2 dependencies — they require LINE credentials + DB migration + real session
- No security debt introduced by Phase 1 work; all stubs are explicit, none are silent

- Next Safe Step: TASK-019 — PWA manifest and baseline config

## Last Updated
2026-04-06
