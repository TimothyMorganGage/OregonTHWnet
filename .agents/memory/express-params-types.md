---
name: Express params typed as string | string[]
description: Why req.params.x needs String() coercion in this repo's api-server
---

In `@types/express-serve-static-core@5.1.1` (pulled transitively by `@types/express@5.0.6`, Express 5), `ParamsDictionary` is `{ [key: string]: string | string[] }`. So `req.params.x` is `string | string[]`, not `string`.

**Symptom:** `.toLowerCase()` / `eq(col, req.params.id)` fail typecheck with "Property 'toLowerCase' does not exist on type 'string[]'" or "Type 'string[]' is not assignable to ... SQLWrapper".

**Fix:** coerce at the call site — `String(req.params.x)`. Used in `artifacts/api-server/src/routes/team.ts` and `members.ts`.

**Why not pin the types version:** coercion is local and low-risk; a global override risks other packages. Revisit if many more handlers appear.
