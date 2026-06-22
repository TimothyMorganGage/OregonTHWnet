---
name: THW platform auth model
description: How membership and admin access actually work in the THW co-op platform (not Replit Auth)
---

The Oregon THW co-op platform does **not** implement Replit Auth / OpenID / Passport.

- **Member registration**: open public application via the `/join` form → `POST /api/members` (saved to `coop_members`). No sign-in / identity provider for members.
- **Admin access**: bearer access-code model (`team_members` table, `artifacts/api-server/src/lib/auth.ts`). Founder seeded from `ADMIN_TOKEN`. Codes rotated via the admin UI.

**Why:** A 9-slide justice deck once described the co-op as "register and sign in through Replit Auth." That capability does not exist in the codebase, and the deck's hard requirement was no-fabrication/honest framing. Reworded to "apply to join through an open membership flow."

**How to apply:** When writing marketing/deck/landing copy about how people join the platform, describe the open application + access-code admin model. Only claim Replit Auth if it is actually wired up (grep for `openid`/`passport`/`replit.auth` first).
