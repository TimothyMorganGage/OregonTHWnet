# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Cost-savings sourcing (`artifacts/thw-web/src/data/costSavingsSources.ts`)
- **Citation registry** — every dollar figure on the ROI and Forecast pages must reference a citation key from `ALL_CITATIONS`. Real sources currently registered: Kangovi 2020 IMPaCT (Health Affairs), Findley 2014 (J Asthma), **AHRQ HCUP SB #316 (Feb 2026, 2022 inpatient data)** and **SB #304 (Sept 2023, 2016–2020 readmissions)**, KFF/Peterson Health Tracker 2022 (ED visit costs), **CMS CY 2026 PFS Final Rule CMS-1832-F** (G0019/G0023 CHI codes; revised "upstream drivers of health" terminology), Oregon 1115 Medicaid Demonstration Waiver (2022–2027, no renewal yet), **Milbank Memorial Fund Nov 2025 CHW Medicaid Reimbursement Update** (supersedes 2021 NACHW landscape).
- **Citation refresh log** — last refreshed May 13, 2026. Replaced AHRQ SB #261 → #316; AHRQ SB #248 → #304; CMS PFS 2024 → CY 2026 Final Rule; CDC NVSS 2021 provisional → NVSR 74-6 (July 2025, 2023 final data); OHA SHIP 2020–2024 → SHIP 2025–2029 (March 10, 2026); NACHW 2021 → Milbank Nov 2025 update. Variable names (e.g. `CDC_LIFE_EXPECTANCY_2021`) and registry IDs are kept stable to avoid breaking existing `citationKey` references in pages — only the displayed `short`/`full`/`year`/`url`/`keyFinding`/`caveats` fields were updated. NACHW 2021 standalone report and the OHA THW Program annual report had no clearly newer official release as of the refresh date.
- **`not_verified` citation** — used as a placeholder when a figure cannot be sourced. ILOSMapping rows with `not_verified` cost citations render as service-mapping examples only; per-visit and annual savings are not displayed for them.
- **Anchor**: combined ROI projections are anchored on the Penn IMPaCT-published 2.47:1 ratio (Kangovi 2020). Year-over-year FORECAST_DATA is a parametric S-curve growing from a denial-heavy startup phase (2024 ~1.2x) toward a steady state slightly above the IMPaCT baseline (2030 ~2.7x). All FORECAST_DATA rows carry `basis: "illustrative_projection"` because Oregon-specific actuals are not yet published.
- **Methodology block** in `costSavingsSources.ts` explains four ROI approaches: simple ROI (current), NPV (recommended for multi-year), cost-effectiveness analysis with QALYs, scenario analysis with conservative/base/optimistic ranges.
- **UI surfacing**: `/roi` and `/forecast` carry amber methodology banners; the ROI page renders a `CitationPill` next to every dollar value, a Methodology section, and a full Sources bibliography at the bottom. Hover any citation pill for the full reference + caveats.

### Equity 2030 page (`artifacts/thw-web/src/pages/Equity2030.tsx`)
- **Question answered**: what denial-rate trajectory by payer segment (Medicaid / Commercial / Medicare Advantage) has to be true for the THW workforce to reach disparity-closing density by 2030.
- **Frame**: planning model with explicit conditional logic ("what would have to be true"), not a prediction. Banner makes this explicit.
- **Inputs**:
  - IMPaCT density target (1 CHW : ~250 high-need patients) — Kangovi 2020
  - Workforce sustainability threshold (≥75% of billed visits must pay) — Milbank Nov 2025 CHW finance update (supersedes NACHW 2021 landscape)
  - Oregon coverage distribution (~30% Medicaid, ~50% commercial, ~17% Medicare) — KFF
  - Disparity baseline: CDC NCHS Life Expectancy 2021 (national) + OHA SHIP (Oregon priority populations); Oregon-specific gap magnitudes flagged "Citation needed"
- **Lever table** rates each lever as `underway` / `needs advocacy` / `blocked` and names who controls it (OHA, CCOs, legislature, DCBS Insurance Commissioner, ERISA employers, CMS).
- **Honest shortfall section** lists what the model does NOT claim (achievability of trajectory, sufficiency of workforce alone, transferability of IMPaCT density to rural/tribal Oregon, separation of denial-rate from reimbursement-rate).
- New citations registered in `costSavingsSources.ts`: `cdc_life_expectancy_2021`, `oha_ship_2024`, `kff_oregon_coverage`, `oha_thw_registry`. Wired into nav as `/equity-2030` with Target icon.

### Demo data governance
- **All client records are fictional** ("Client A" through "Client L"). Notes describe service categories only — no personal detail. No consent obtained because no real client exists.
- **Insurance plan names are public; operational specifics are not yet verified.** `denialRate`, `avgProcessingDays`, `approvedCPTCodes`, `contactPhone`, `contactEmail`, and `coverageStartDate` are intentionally omitted on every plan until verified against the plan's published provider manual or directly with the plan. UI renders "Not verified" for missing values.
- The `InsurancePlan` type makes `denialRate`, `avgProcessingDays`, and `approvedCPTCodes` optional. Every operational field defaults to undefined and only becomes a real number once it has a verifiable source.
- Amber `Demo data` disclosure banners are pinned to the top of `/claims` and `/insurance`. Do not remove them until real verified data has replaced the placeholders.
- Source-of-truth comment block lives at the top of `artifacts/thw-web/src/data/sampleData.ts`.

### Cooperative member backend (`artifacts/api-server` + `lib/db`)
- **Endpoints (public)**:
  - `POST /api/members` — accepts a membership application (saves to `coop_members`)
  - `GET /api/members` — returns ONLY approved members with PII (email/phone/notes) stripped
- **Endpoints (admin, gated to active team members — see Team-member access)**:
  - `GET /api/admin/me` — returns the signed-in team member's email/role
  - `GET /api/admin/members` — full list with PII for review
  - `PATCH /api/admin/members/:id` — `{ reviewStatus?, ohaVerified?, reviewerNotes? }`; `reviewedAt` stamps only when status changes
  - `GET /api/admin/members.csv` — CSV export with formula-injection defang
  - `GET /api/admin/team-members` — list of current team members (codes never returned)
  - `POST /api/admin/team-members { email, notes? }` — adds new member, returns one-time `accessCode`
  - `PATCH /api/admin/team-members/:email { active?, notes? }` — revoke/reactivate; founder + self cannot be revoked
  - `POST /api/admin/team-members/:email/rotate` — generates a fresh code for an existing member, invalidates old
- **Team-member access**:
  - `team_members` table: email PK, accessCode (unique), role, active, addedBy, addedAt, lastUsedAt, notes
  - On server startup, `seedFounderIfMissing()` inserts `tmgtyw@gmail.com` with `ADMIN_TOKEN` as their initial accessCode if no team rows exist — zero-downtime cutover from the old single-token model
  - Auth middleware (`artifacts/api-server/src/lib/auth.ts`) looks up bearer token in `team_members` where `active = true`, attaches `req.teamMember`, and async-stamps `lastUsedAt`
  - Access codes are 24 random bytes (hex). Stored plaintext in DB (same risk profile as the original ADMIN_TOKEN env var); rotate via the UI if compromised
- **Web admin UI** (`/admin` in thw-web — unlinked from sidebar, organizer must navigate directly):
  - Sign-in: "Team member sign-in" — accepts personal access code, persisted in `sessionStorage`
  - **Applications tab**: status filter cards, OHA-verified checkbox, notes textarea (saves on blur), approve/decline/reset buttons, CSV export
  - **Team & access tab**: invite-member form (generates one-time access code shown in a copy-once amber banner with copy-to-clipboard + "Done" dismiss); team list with rotate-code, revoke, reactivate buttons; founder + self are protected from revocation in both UI and API

### Remix landing page (`/remix` in thw-web)
- Pitches the platform to other states, tribal nations, and allied health authorities
- Sections: hero with two CTAs, audience cards, "what's in the box" feature list, customization mapping table (Oregon → Your jurisdiction), 4-step remix guide, files-to-edit reference, collaboration callout
- Two CTAs: a "Remix on Replit" button (link `REPLIT_PROJECT_URL` constant — currently a placeholder; update to the actual published Replit URL after first deploy) and a prefilled mailto to `tmgtyw@gmail.com` for direct collaboration requests
- Linked from sidebar as "Remix for your state"

### Member Forum (`artifacts/api-server` /forum + `artifacts/thw-web` /forum) — public
- **Endpoints**:
  - `POST /api/forum/posts` — public, accepts `{ authorName, authorEmail?, subject, message }`, returns the created post (with email)
  - `GET /api/forum/posts` — public, returns most-recent 200 posts. Author email is OMITTED from the public listing (organizer sees it via the routed email instead).
- **Storage**: `forum_posts` table (id text PK, author_name, author_email nullable, subject, message, created_at).
- **Email routing**: every POST also auto-opens the user's mail client with a prefilled message to `tmgtyw@gmail.com` containing the post's subject/body so the organizer is notified of every new post.
- **Sidebar nav**: "Member Forum" entry added to `Layout.tsx` after "Join the Co-op".

Note: the `/join` page also retains its own email-routing flow — submitting a membership application saves to the `coop_members` table AND auto-opens the user's email client with a prefilled application addressed to `tmgtyw@gmail.com`.

### THW Accounting Platform (`artifacts/thw-platform`)
- **Type**: Expo mobile app
- **Purpose**: Accounting platform for Traditional Health Workers (THWs) in Oregon
- **Storage**: AsyncStorage (local persistence, no backend required)
- **Screens**:
  - Dashboard — overview with 2030 zero-denial forecast, HEDIS metrics, recent claims
  - Claims — manage billing claims with CPT and Z code selection
  - HEDIS — HEDIS measure tracking and 2030 econometric forecast
  - Insurance Plans — track Oregon and national plan coverage status for THW services
  - Denial Management — track, appeal, and resolve denied claims
  - New Claim (modal) — 4-step claim creation wizard
  - Claim Detail — view/submit/delete individual claims
- **Key Data**:
  - 15 THW-specific CPT codes (G0019, G0023, T1015-T1017, 96150, H0038, etc.)
  - 25 Z codes for SDOH documentation
  - 8 HEDIS measures with THW impact data
  - 10 insurance plans (Oregon + national) with coverage status
  - Econometric forecast data 2024–2030 tracking toward zero denials
- **Dependencies**: AsyncStorage, react-native-svg, expo-haptics
