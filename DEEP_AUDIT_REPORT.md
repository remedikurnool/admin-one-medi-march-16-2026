# ONE MEDI Admin Platform — Deep Codebase Audit Report

Date: 2026-03-24

## 1) Executive Summary

The codebase is a modern Next.js App Router admin panel with broad Supabase schema coverage across commerce, diagnostics, logistics, marketing, finance, inventory, locations, analytics, notifications, and audit. The foundation is good (clean module separation, reusable table patterns, coherent visual language), but there are **critical production-readiness gaps**:

- **No explicit admin auth/authorization guard** at route/layout level while most data access uses service-role Supabase client.
- **Large navigation-to-route mismatch** (many sidebar links point to non-existent pages).
- **Type-safety debt** (`any`, `Record<string, unknown>`, empty generated types file) and lint failures.
- **Operational quality issues** (default Next.js landing page at `/`, locale/currency inconsistencies, weak env key consistency).

Current state: useful internal prototype with strong UI momentum, but not yet hardened for enterprise admin operations.

---

## 2) Architecture Findings

### 2.1 Framework and Structure

- Stack: Next.js App Router + React 19 + TypeScript + Tailwind + shadcn-style UI + TanStack Table.
- Layout and shell are cleanly centralized in `src/app/admin/layout.tsx` (sidebar/header/footer + content slot).
- Data layer is modularized by domain under `src/lib/db/*`, which is a good separation for maintainability.

### 2.2 Supabase Integration Pattern

- Server reads are mostly performed via `createAdminClient()` using service role key.
- Browser client and server client helpers exist, but domain db modules overwhelmingly use admin client.
- This pattern is acceptable for trusted server-only admin pipelines **only when strict authz gates are present**.

### 2.3 UI Composition

- Shared datatable system under `src/components/admin/*` supports searching/filtering/sorting and is reusable.
- Many module dashboards are server components that fetch and render data directly.
- Some modules are still placeholders (e.g., consultations main page uses `ModulePlaceholder`).

---

## 3) Security and Access Control Audit

### Severity: **Critical**

1. **No route-level admin guard visible in layout.**
   - Admin layout renders children directly and does not validate session/role before rendering.
   - Risk: unauthorized users could potentially access admin pages if routing/network layer is not protected elsewhere.

2. **Service-role Supabase access is broadly used.**
   - `createAdminClient()` uses `SUPABASE_SERVICE_ROLE_KEY`, bypassing RLS by design.
   - This is high privilege and should only be reached behind strict server-side authorization checks.

3. **No middleware/auth pipeline detected in repo.**
   - No `middleware.ts` or auth route enforcement artifacts found in scanned app files.

### Recommendations

- Enforce role-based guard at `src/app/admin/layout.tsx` (server-side check before rendering any admin child route).
- Restrict service-role usage to minimal paths; prefer RLS-safe server client for read operations where possible.
- Add centralized authorization utility (`requireAdmin()`), with structured audit logs for denied access.

---

## 4) Functional Coverage and Navigation Integrity

### Severity: **High**

- Sidebar declares a rich route map (56 URLs), but 34 routes are missing corresponding `page.tsx` implementations.
- This creates broken navigation paths and a fragmented UX.

### Impact

- Operators click into dead links.
- Perceived platform incompleteness and lower trust.
- Higher support burden and onboarding friction.

### Recommendations

- Introduce route completeness CI check (compare sidebar route URLs against filesystem routes).
- For incomplete pages, either:
  - remove links temporarily, or
  - auto-route to a consistent “Coming Soon” page.

---

## 5) Data Access and Query Layer Audit

### Strengths

- Domain-level db helpers are clear and straightforward.
- Schema-scoped queries (`.schema('commerce')`, etc.) reflect Supabase multi-schema organization.

### Risks / Gaps

1. **Inconsistent key env usage between clients.**
   - Server helper uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` while browser helper uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Potential misconfiguration risk across environments.

2. **Error handling inconsistency.**
   - Some db helpers `throw`, others log-and-fallback to empty arrays; behavior is inconsistent and harder to reason about.

3. **Potential schema join fragility.**
   - Some joins rely on inferred/cross-schema paths and include fallback comments for likely join failures.

### Recommendations

- Standardize env key naming and validation at startup.
- Normalize db helper contracts: either always throw typed errors or return a `Result` object consistently.
- Add lightweight query contract tests per module.

---

## 6) TypeScript Quality and Maintainability

### Severity: **High**

1. **Lint currently fails** with multiple `no-explicit-any` errors and unused symbols.
2. Heavy use of `Record<string, unknown>` in page-level rendering logic increases casting risk.
3. `src/types/supabase-analytics.ts` exists but is empty (0 lines), indicating type generation / schema typing is incomplete.

### Recommendations

- Generate Supabase typed schema and consume it in db helpers.
- Replace `any` with explicit interface types per table/view.
- Enforce lint-as-gate in CI (`npm run lint` must pass).

---

## 7) Product and UX Audit

### Findings

- `/` still serves default Next.js starter page rather than branded/admin entrypoint.
- Locale/currency presentation is mixed (e.g., INR symbol and `en-IN` formatting appear in several pages, while dashboard uses `$`).
- Placeholder messaging is clear and visually consistent, but route-level parity with sidebar is incomplete.

### Recommendations

- Replace root page with branded login/admin gateway.
- Centralize formatting helpers (`formatCurrency`, `formatDateTime`) and bind to tenant/region config.
- Add feature flags to hide unfinished modules from navigation.

---

## 8) DevOps / Release Readiness

### Findings

- Build failed in this environment because Google Font fetch (`Geist`, `Geist Mono`) could not be reached at build time.
- React compiler warnings appear with TanStack Table hooks (known incompatibility warning path).

### Recommendations

- Make build resilient in restricted network CI environments (self-hosted fonts or fallback local font strategy).
- Keep React compiler warnings tracked in tech debt; validate no stale memoization assumptions are introduced.

---

## 9) Prioritized Remediation Roadmap

### Phase 0 (Immediate: 1–3 days)

1. Add server-side admin authorization guard in `/admin` layout.
2. Remove/hide broken sidebar links OR map them to a common placeholder page.
3. Fix lint errors that block CI confidence.

### Phase 1 (Short term: 1–2 weeks)

1. Standardize Supabase env key strategy + startup validation.
2. Introduce generated Supabase DB types and remove `any` from hot paths.
3. Implement consistent error/result pattern in db layer.

### Phase 2 (Medium term: 2–4 weeks)

1. Route completeness checks in CI.
2. Currency/locale standardization helpers.
3. Replace root starter page with production entry/auth UX.

### Phase 3 (Hardening)

1. Add integration tests for critical admin modules.
2. Add observability for query errors and auth-denied events.
3. Security review for least-privilege access and secret handling lifecycle.

---

## 10) Overall Maturity Assessment

- **UI/Module foundation:** 7/10
- **Data integration breadth:** 8/10
- **Type safety:** 4/10
- **Security hardening:** 3/10
- **Operational readiness:** 5/10

**Overall:** ~5.4/10 (strong prototype, needs security/auth + quality hardening before production-grade admin deployment).
