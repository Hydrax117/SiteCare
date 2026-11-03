# SiteCare — Implementation Progress

> Last updated: 3 November 2026
> Branch strategy: one branch per issue (`feat/SC-XXX-short-description`)

---

## Overall status

| Milestone | Issues | Status |
|-----------|--------|--------|
| M1 — Foundation | SC-001 to SC-005 | 🟡 In progress |
| M2 — Monitoring engine | SC-006 to SC-011 | ⬜ Not started |
| M3 — Website care | SC-012 to SC-016 | ⬜ Not started |
| M4 — Agency features | SC-017 to SC-020 | ⬜ Not started |
| M5 — Monetisation | SC-021 to SC-024 | ⬜ Not started |
| M6 — Public tools & SEO | SC-025 to SC-029 | ⬜ Not started |
| M7 — Production hardening | SC-030 to SC-033 | ⬜ Not started |
| M8 — Launch | SC-034 to SC-035 | ⬜ Not started |

---

## M1 — Foundation (Days 1–4)

### SC-001 — Initialise pnpm monorepo ✅
- **Branch:** `feat/SC-001-monorepo-setup`
- **Commit:** `d9e871c`, `4703a66`
- **Completed:** 3 November 2026
- **What was done:**
  - pnpm workspace with `apps/web`, `apps/worker`, and 7 shared packages
  - TypeScript strict mode (`tsconfig.base.json`)
  - ESLint flat config with `@typescript-eslint/recommended-type-checked`
  - Prettier config
  - `@sitecare/shared` — typed errors, API response envelopes, structured logger, Zod env validation
  - `@sitecare/database` — Prisma client singleton + full MVP schema (all models)
  - `@sitecare/billing` — plan limits and prices (server-side source of truth)
  - `@sitecare/security`, `@sitecare/monitoring`, `@sitecare/queue`, `@sitecare/email` — stubs
  - Worker entry point with graceful shutdown skeleton
  - GitHub Actions CI workflow
  - `.kiro/steering/` docs (product, architecture, security)
- **Lint:** ✅ 0 errors | **Typecheck:** ✅ 0 errors | **Build:** ✅ passes
- **Known issue:** `next lint` prints advisory about Next.js ESLint plugin not detected — cosmetic, zero actual errors

---

### SC-002 — PostgreSQL and Prisma foundation ⬜
- **Branch:** `feat/SC-002-database-prisma`
- **Dependencies:** SC-001
- **Scope:**
  - [ ] Configure PostgreSQL connection
  - [ ] Run first Prisma migration (`001_initial_auth`)
  - [ ] Confirm all migrations apply to a clean database
  - [ ] Add database health check endpoint
  - [ ] Add development seed script
- **Acceptance:** Migration applies cleanly; app connects to DB

---

### SC-003 — Authentication ⬜
- **Branch:** `feat/SC-003-authentication`
- **Dependencies:** SC-002
- **Decision needed:** Email/password credentials vs OAuth vs email OTP — confirm before starting
- **Scope:**
  - [ ] Integrate Auth.js
  - [ ] Registration and email verification flow
  - [ ] Secure sessions and protected routes
  - [ ] Tests: registration, duplicate email, unverified access, protected routes
- **Acceptance:** Unverified users cannot access monitoring features

---

### SC-004 — Shared API conventions ⬜
- **Branch:** `feat/SC-004-api-conventions`
- **Dependencies:** SC-002
- **Scope:**
  - [ ] Shared Zod schemas for common inputs
  - [ ] Standard success/error response envelopes (already scaffolded in shared — wire into routes)
  - [ ] Typed application errors (already scaffolded — wire into API handlers)
  - [ ] Structured logging and request IDs in API routes
- **Acceptance:** All API routes use shared validation and response conventions

---

### SC-005 — URL and network security ⬜
- **Branch:** `feat/SC-005-url-network-security`
- **Dependencies:** SC-001
- **⚠ Security release blocker**
- **Scope:**
  - [ ] URL parsing and normalisation
  - [ ] Block private, loopback, link-local, multicast, reserved IPv4/IPv6
  - [ ] DNS resolution with all-address inspection
  - [ ] Pin connection to validated IP (DNS rebinding defence)
  - [ ] Redirect revalidation (every hop)
  - [ ] Connection/total timeouts and response-size limits
  - [ ] Tests: SSRF, private IPs, redirect attacks, DNS rebinding, timeouts
- **Acceptance:** Automated SSRF and redirect tests pass including DNS rebinding cases

---

## M2 — Monitoring engine (Days 5–10)

### SC-006 — Website CRUD and ownership ⬜
- [ ] Create/read/update/delete website endpoints
- [ ] Ownership enforcement on every operation
- [ ] Plan-based website count limits
- [ ] URL normalisation, pause/resume

### SC-007 — HTTP monitoring ⬜
- [ ] HTTP/HTTPS check execution
- [ ] Record status code, response time, final URL, error category
- [ ] Handle DNS errors, TLS errors, timeouts, non-2xx

### SC-008 — pg-boss queue and worker ⬜
- [ ] Configure pg-boss
- [ ] Worker process with job handlers
- [ ] Retry handling and idempotency
- [ ] Graceful shutdown and restart recovery

### SC-009 — Monitoring scheduler ⬜
- [ ] Find and enqueue due websites
- [ ] Respect paused state and plan interval
- [ ] Prevent duplicate scheduling

### SC-010 — Incident state engine ⬜
- [ ] Consecutive failure threshold → open incident
- [ ] Consecutive success threshold → close incident
- [ ] Concurrency-safe (no duplicate open incidents)

### SC-011 — Monitoring history and uptime ⬜
- [ ] Persist check history with pagination
- [ ] Retention rules per plan
- [ ] Uptime calculation with explicit missing-observation handling

---

## M3 — Website care (Days 11–15)

### SC-012 — SSL certificate monitoring ⬜
### SC-013 — Notification preferences ⬜
### SC-014 — Transactional email system ⬜
### SC-015 — Main dashboard ⬜
### SC-016 — Website detail page ⬜

---

## M4 — Agency features (Days 16–20)

### SC-017 — Client groups ⬜
### SC-018 — Agency client dashboard ⬜
### SC-019 — Client health reports ⬜
### SC-020 — Public report pages ⬜

---

## M5 — Monetisation (Days 19–22)

### SC-021 — Subscription entitlement service ⬜
- **Decision needed:** Payment provider (Stripe, Paddle, Lemon Squeezy — confirm eligibility)

### SC-022 — Checkout integration ⬜
### SC-023 — Verified billing webhooks ⬜
### SC-024 — Pricing and billing interface ⬜

---

## M6 — Public tools and SEO (Days 23–25)

### SC-025 — Website status checker ⬜
### SC-026 — SSL checker ⬜
### SC-027 — DNS checker ⬜
### SC-028 — Redirect checker ⬜
### SC-029 — SEO foundations ⬜

---

## M7 — Production hardening (Days 26–28)

### SC-030 — Security and reliability test suite ⬜
### SC-031 — VPS deployment ⬜
### SC-032 — Backups and observability ⬜
### SC-033 — End-to-end QA ⬜

---

## M8 — Launch (Days 29–30)

### SC-034 — Beta onboarding ⬜
### SC-035 — Production launch ⬜

---

## Open decisions (resolve before the relevant milestone)

| # | Decision | Needed by |
|---|----------|-----------|
| 1 | Payment provider (eligibility, recurring billing, currency support) | SC-021 |
| 2 | Auth strategy: email/password, email OTP, OAuth, or combination | SC-003 |
| 3 | Transactional email provider (sending limits, domain auth, pricing) | SC-014 |
| 4 | Validate $5/$15 pricing with real agency users | SC-024 |
| 5 | Measure worker/DB capacity before offering sub-5-minute checks | SC-009 |
| 6 | Branded reports: Agency-only or later add-on? | SC-019 |
| 7 | Data retention and deletion request handling | SC-011 |

---

## Key commands

```bash
# Install
pnpm install

# Development
pnpm --filter @sitecare/web dev       # web app on :3000
pnpm --filter @sitecare/worker dev    # worker process

# Quality checks (run before every commit)
pnpm lint
pnpm typecheck
pnpm test
pnpm build

# Database
pnpm db:generate        # regenerate Prisma client after schema changes
pnpm db:migrate         # deploy migrations (production)
pnpm db:migrate:dev     # create + apply migration (development)
```

---

## Status legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Complete — all acceptance criteria met |
| 🟡 | In progress |
| ⬜ | Not started |
| 🔴 | Blocked |
