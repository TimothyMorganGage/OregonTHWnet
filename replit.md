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

### Cooperative member backend (`artifacts/api-server` + `lib/db`)
- **Endpoints**:
  - `POST /api/members` — public, accepts a membership application (saves to `coop_members` table, returns full record)
  - `GET /api/members` — public, returns ONLY approved members with PII (email/phone/notes) stripped
  - `GET /api/admin/members` — Bearer `ADMIN_TOKEN`, returns all members with full PII for review
  - `PATCH /api/admin/members/:id` — Bearer `ADMIN_TOKEN`, accepts `{ reviewStatus?, ohaVerified?, reviewerNotes? }`. `reviewedAt` only updates when `reviewStatus` changes.
  - `GET /api/admin/members.csv` — Bearer `ADMIN_TOKEN`, downloads roster CSV with formula-injection defang
- **Auth**: single shared `ADMIN_TOKEN` env var (server-side check). Web admin page stores token in `sessionStorage` only.
- **Web admin UI** (PAUSED 2026-04-21): `/admin` route in `thw-web` was a login-gated console with status filter cards, OHA-verified checkbox, notes textarea (saves on blur), approve/decline buttons, CSV export. The route is currently disabled in `App.tsx`; the `Admin.tsx` page file is retained and can be re-enabled by uncommenting the import + `<Route>` line. The `ADMIN_TOKEN` secret and the `/api/admin/*` server endpoints remain available.

### Member Forum (`artifacts/api-server` /forum + `artifacts/thw-web` /forum)
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
