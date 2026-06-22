---
name: THW platform auth model
description: How membership and admin access actually work in the THW co-op platform
---

The Oregon THW co-op platform uses **two separate auth models** — do not conflate them.

- **Member registration → Replit Auth (OIDC).** Applying to join is gated behind sign-in. `POST /api/members` requires `req.isAuthenticated()` (401 otherwise) and attaches the verified identity (`userId` + verified email) to the `coop_members` row server-side. Web `/join` form is gated behind `useAuth()` from `@workspace/replit-auth-web`: signed-out users see a "Log in to continue" CTA, signed-in users get name/email prefilled. The OIDC server lib lives in `artifacts/api-server/src/lib/replitAuth.ts` (NOT `lib/auth.ts`).
- **Admin access → bearer access-code model**, completely independent of Replit Auth. `team_members` table + `artifacts/api-server/src/lib/auth.ts` (`requireAdmin`). Founder seeded from `ADMIN_TOKEN`. Codes rotated via the admin UI. The auth middleware just won't set `req.user` for admin bearer codes — no conflict.

**Why the two libs are named differently:** `lib/auth.ts` already existed for the access-code admin system. The Replit-Auth OIDC code had to go in `replitAuth.ts` to avoid clobbering it.

**Copy/deck rule:** Member registration genuinely runs through Replit Auth now, so decks/landing copy MAY say so (deck slide 5 `OpenCooperative.tsx` does). UI buttons must still use generic wording ("Log in"), never "Replit"/"Replit Auth" — that restriction is UI-only, not deck text.
