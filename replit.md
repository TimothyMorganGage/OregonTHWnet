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
