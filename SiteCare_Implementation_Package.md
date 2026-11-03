# SiteCare --- Product & Engineering Implementation Package

**Version:** 1.0\
**Prepared:** 3 November 2026\
**Product:** SiteCare --- website monitoring and agency website-care
platform\
**Launch target:** 30 days\
**Primary audience:** Freelancers and small web agencies\
**Initial market:** Global\
**Monetisation:** Freemium subscriptions, with AdSense on eligible
public content/tool pages

------------------------------------------------------------------------

## 1. Product overview

SiteCare helps freelancers and small web agencies manage the health of
client websites from one place.

The platform combines:

-   Website uptime and HTTP response-time monitoring.
-   SSL certificate validity and expiry monitoring.
-   Outage detection and recovery tracking.
-   Email alerts for outages, recoveries, and SSL expiry.
-   Client groups and multiple websites per client.
-   Shareable client-facing website health reports.
-   Free public diagnostic tools that attract organic search traffic.
-   Paid subscriptions for higher monitoring limits, history, and agency
    features.

### Product positioning

**SiteCare is a practical website-care workspace for agencies.** It
should do real operational work: perform network checks, inspect TLS
certificates, resolve DNS records, execute redirect chains, schedule
checks, detect incidents, and report on website health.

It is not an AI wrapper. Do not prioritise AI-generated summaries or
features that users can easily reproduce with a general-purpose AI
assistant.

### Differentiator

The primary differentiator is the agency workflow:

1.  Organise websites by client.
2.  Monitor all client websites from one dashboard.
3.  Identify outages and SSL problems.
4.  Generate a professional, shareable health report.
5.  Optionally apply agency branding to reports.

Compete on useful agency workflows, not enterprise observability
features.

------------------------------------------------------------------------

## 2. Product scope

### 2.1 MVP features

#### Monitoring

-   Add, edit, pause, resume, and delete websites.
-   Perform scheduled HTTP/HTTPS checks.
-   Record status code, response time, final URL, and error category.
-   Detect outages using configurable consecutive-failure thresholds.
-   Detect recovery using consecutive-success thresholds.
-   Monitor SSL certificate hostname validity and expiry.
-   Retain monitoring history according to subscription plan.

#### Notifications

-   Outage email alerts.
-   Recovery email alerts.
-   SSL expiry warnings.
-   User-configurable notification preferences.
-   Deduplicate notifications and retry transient email failures.

#### Agency workspace

-   Create and manage client groups.
-   Assign websites to client groups.
-   View website health by client.
-   Generate shareable health reports.
-   Revoke or expire public report links.

#### Public diagnostic tools

1.  Website status checker.
2.  SSL checker.
3.  DNS checker.
4.  Redirect checker.

#### Subscription platform

-   Free and paid plans.
-   Server-side entitlement enforcement.
-   Checkout, payment confirmation, renewal, cancellation, and
    failed-payment handling.
-   Usage and billing page.

### 2.2 Out of scope for the first release

-   Native mobile applications.
-   Kubernetes or microservices.
-   Redis unless a demonstrated requirement emerges.
-   Complex synthetic browser journeys.
-   Full page-speed auditing or Lighthouse replacement.
-   Advanced team permissions and enterprise SSO.
-   White-label custom domains.
-   AI-generated website recommendations.
-   SMS, WhatsApp, and push notifications.
-   Public status pages with custom domains.
-   One-minute checks before infrastructure capacity has been measured.

### 2.3 Launch strategy

The 30-day target is a disciplined MVP, not a reason to compromise
reliability or security.

If the schedule slips: - Reduce the number of public tools. - Defer
secondary report styling. - Defer advanced billing features. - Keep SSRF
protection, incident correctness, ownership checks, and backup/restore
testing.

------------------------------------------------------------------------

## 3. Audience and user journeys

### Primary audience

Freelancers and small web agencies managing several client websites.

### Core user journeys

#### Journey A --- Start monitoring a website

1.  User creates an account and verifies their email.
2.  User opens the dashboard.
3.  User adds a website URL.
4.  Server validates the URL and checks that it is safe to monitor.
5.  The initial check is queued.
6.  The website appears in the dashboard with its latest check state.
7.  Scheduled checks continue at the interval allowed by the user's
    plan.

#### Journey B --- Manage a client

1.  User creates a client group.
2.  User adds client websites or assigns existing websites.
3.  User views the health of all websites for that client.
4.  User filters by healthy, degraded, down, or SSL warning.
5.  User creates a shareable report.
6.  User sends the report link to the client.

#### Journey C --- Handle an outage

1.  A scheduled check fails.
2.  The system records the failure.
3.  The incident engine waits for the configured consecutive-failure
    threshold.
4.  An incident is opened once the threshold is reached.
5.  An outage notification is queued if enabled.
6.  Successful checks continue.
7.  The recovery threshold is reached.
8.  The incident is closed and a recovery notification is queued.

#### Journey D --- Use a public tool

1.  Visitor opens a diagnostic tool page.
2.  Visitor submits a domain or URL.
3.  The server validates and safely executes the requested diagnostic.
4.  The result is displayed with useful technical details.
5.  The page provides clear next steps and links to related tools.
6.  Visitor can create an account to monitor the website continuously.

------------------------------------------------------------------------

## 4. Plans and monetisation

The following prices and limits are initial hypotheses. Validate
willingness to pay with agency users before treating them as final.

  Feature                  Free     Starter               Agency
  ----------------- ----------- ----------- --------------------
  Websites                    3          10                   30
  Check interval      5 minutes   5 minutes   Capacity-dependent
  History                7 days     30 days              90 days
  Client groups           Basic    Included             Included
  Reports                 Basic    Included    Branded/shareable
  Weekly reports             No         Yes                  Yes
  Suggested price           \$0   \$5/month           \$15/month

### Monetisation principles

-   Enforce all plan limits on the server.
-   Never trust a plan or price sent by the browser.
-   Do not silently delete websites when a subscription is downgraded.
-   On downgrade, preserve data and prevent new usage beyond the plan
    limit. Clearly explain what is paused or restricted.
-   Keep billing provider integration behind an adapter.
-   Verify webhook signatures and process events idempotently.
-   Treat the proposed \$5 and \$15 prices as experiments, not validated
    market rates.

### AdSense strategy

AdSense is not a dependable fast route to meaningful revenue without
substantial traffic. Subscription revenue is the more credible early
monetisation path if agencies receive recurring value.

Use ads only on suitable public pages. Do not place ads inside the
authenticated monitoring dashboard. Avoid thin, duplicated,
programmatically generated tool pages. Each public tool page should have
original explanatory content, useful result presentation, and clear
navigation.

------------------------------------------------------------------------

## 5. Technical architecture

### 5.1 Recommended stack

-   **Web:** Next.js + TypeScript (strict mode)
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Authentication:** Auth.js
-   **Queue and scheduler:** pg-boss
-   **Worker:** Separate Node.js process
-   **Validation:** Zod
-   **Workspace:** pnpm workspaces
-   **Email:** Provider-agnostic email package
-   **Deployment:** Ubuntu VPS, Nginx, PM2, GitHub Actions
-   **Optional edge/DNS layer:** Cloudflare

Do not introduce Redis, Kubernetes, or microservices for the MVP.

### 5.2 Monorepo structure

``` text
sitecare/
├── apps/
│   ├── web/
│   └── worker/
├── packages/
│   ├── database/
│   ├── monitoring/
│   ├── queue/
│   ├── billing/
│   ├── email/
│   ├── security/
│   └── shared/
├── docs/
├── .github/
├── package.json
└── pnpm-workspace.yaml
```

### 5.3 Runtime boundaries

**Web application** - Authentication and sessions. - Dashboard and
public pages. - API routes. - Website and client management. - Report
creation and viewing. - Billing user interface and checkout initiation.

**Worker** - Scheduled website checks. - HTTP monitoring. - SSL
inspection. - Incident evaluation. - Email delivery. - Report generation
where asynchronous processing is needed. - History retention and
cleanup.

The web application and worker must run as separate processes. A web
deployment must not accidentally start a second scheduler or duplicate
monitoring jobs.

### 5.4 Queue responsibilities

Use pg-boss for: - Scheduling due website checks. - Executing monitoring
jobs. - Retry handling. - Incident evaluation. - Notification
delivery. - Weekly summaries. - Report generation. - Retention cleanup.

Jobs must be idempotent where possible. Prevent duplicate scheduling and
duplicate open incidents. Monitor queue backlog and worker health.

------------------------------------------------------------------------

## 6. Security and reliability requirements

Security is a release blocker, especially because users can submit URLs
for the server to inspect.

### 6.1 SSRF protection

The platform must not become a proxy into private infrastructure.

-   Accept only supported HTTP and HTTPS URLs for website checks.
-   Reject localhost, loopback, private, link-local, multicast,
    reserved, and otherwise non-public IPv4 and IPv6 destinations.
-   Resolve DNS and inspect all returned addresses.
-   Validate the actual destination used for the connection, not just a
    preliminary DNS lookup.
-   Pin or otherwise constrain the network connection to the validated
    IP to defend against DNS rebinding.
-   Preserve the correct Host header and TLS SNI hostname when
    connecting to a validated IP.
-   Revalidate every redirect destination before following it.
-   Limit redirect count.
-   Set strict connection and total timeouts.
-   Limit response bytes read.
-   Do not forward user cookies, authorization headers, or credentials.
-   Do not expose internal IP addresses in public tool responses.
-   Rate-limit anonymous diagnostic endpoints.

A DNS lookup followed by an ordinary unrestricted `fetch()` is not
sufficient protection against DNS rebinding.

### 6.2 Authentication and ownership

-   Require verified accounts for persistent monitoring.
-   Check ownership on every website, client group, report, and billing
    operation.
-   Return safe 404/403 responses without leaking another user's
    records.
-   Use secure session and cookie settings.
-   Rate-limit authentication and sensitive endpoints.
-   Do not log passwords, session tokens, API keys, payment secrets, or
    report tokens.

### 6.3 Payments

-   Resolve plan and price server-side.
-   Verify provider webhook signatures.
-   Store provider event IDs and enforce idempotency.
-   Never activate a subscription from a browser redirect alone.
-   Record payment state transitions and failure reasons safely.
-   Handle duplicate, delayed, and out-of-order webhook events.

### 6.4 Public reports

-   Generate cryptographically random report tokens.
-   Store only a hash of the token.
-   Support expiration and revocation.
-   Expose only the data intended for the client.
-   Never include account credentials, private notes, or unrelated
    client data.

### 6.5 Operational reliability

-   Use structured logs and request/job correlation IDs.
-   Monitor worker process health and queue backlog.
-   Back up PostgreSQL off-server.
-   Test database restoration before launch.
-   Use production migrations; do not use `prisma db push` in
    production.
-   Document deployment rollback and migration recovery procedures.

------------------------------------------------------------------------

## 7. Data model and migration plan

Use Prisma with explicit migrations and indexes. The exact schema should
be reviewed before implementation and adapted to the chosen Auth.js
strategy.

### Migration sequence

1.  `001_initial_auth` --- User and required Auth.js adapter tables.
2.  `002_subscriptions` --- Plan and subscription enums/models.
3.  `003_client_groups` --- ClientGroup.
4.  `004_websites` --- Website and website verification state if
    required.
5.  `005_monitoring` --- MonitorCheck.
6.  `006_incidents` --- Incident and relevant indexes.
7.  `007_ssl` --- Latest SSL snapshot and monitoring metadata.
8.  `008_notifications` --- Preferences and notification logs.
9.  `009_reports` --- Reports, token hashes, expiry, and revocation.
10. `010_payments` --- Payment events and provider references.

### Schema considerations

-   Include `createdAt` and `updatedAt` where appropriate.
-   Index ownership fields and common filters.
-   Index due-check timestamps for scheduler queries.
-   Index monitoring history by website and timestamp.
-   Use a concurrency-safe strategy to prevent multiple open incidents
    for one website.
-   Store the latest SSL snapshot separately from general HTTP check
    history.
-   Define retention rules explicitly.
-   Store payment event identifiers with unique constraints.
-   If using the Prisma Auth.js adapter, include the required adapter
    models such as Account, Session, and VerificationToken as
    appropriate to the selected providers.
-   Decide whether email/password Credentials authentication or an
    email/OAuth strategy is being used; do not assume all Auth.js
    strategies use the same adapter flow.

### Monitoring history accuracy

Uptime calculations must define their denominator and handle missing
observations. Do not treat a period with no checks as healthy. Document
how scheduled intervals, delayed jobs, and missing observations affect
the reported percentage.

------------------------------------------------------------------------

## 8. API conventions and contracts

### Standard success response

``` json
{
  "success": true,
  "data": {
    "id": "website_123"
  },
  "meta": {}
}
```

### Standard error response

``` json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The supplied website URL is invalid.",
    "details": {}
  }
}
```

### API rules

-   Use Zod for request validation.
-   Include request IDs in logs.
-   Do not expose raw database errors.
-   Use pagination for collections.
-   Enforce ownership and subscription entitlements server-side.
-   Apply rate limits to public and sensitive endpoints.
-   Use versioned API routes, such as `/api/v1`.
-   Use HTTP status codes consistently: 202, 401, 403, 404, 409, 422,
    429, and 500 as appropriate.

### Initial endpoints

  Method   Endpoint                             Purpose
  -------- ------------------------------------ -------------------------------
  POST     `/api/v1/websites`                   Register a website
  GET      `/api/v1/websites?page=1&limit=20`   List owned websites
  POST     `/api/v1/websites/:id/check`         Queue a manual check
  POST     `/api/v1/tools/status-check`         Run a public status check
  POST     `/api/v1/reports`                    Create a client health report
  POST     `/api/v1/billing/checkout`           Start provider checkout

#### `POST /api/v1/websites`

Requirements: - Authenticated and verified account. - Validate and
normalise URL. - Perform SSRF-safe destination validation. - Enforce
website count and plan limits. - Verify client group ownership if
supplied. - Create website and enqueue initial check. - Return created
resource and queue state.

#### `GET /api/v1/websites`

Requirements: - Return only the authenticated user's websites. - Support
pagination and safe filters. - Cap page size at 100. - Include a stable
latest-check summary where available.

#### `POST /api/v1/websites/:id/check`

Requirements: - Verify ownership. - Apply per-user and per-website rate
limits. - Queue a manual check. - Return `202 Accepted`. - Avoid running
unbounded checks synchronously in the request.

#### `POST /api/v1/tools/status-check`

Requirements: - Anonymous use with strict rate limits. - SSRF protection
identical to persistent monitoring. - Bounded timeout, response size,
and redirect count. - Do not disclose private IP addresses or internal
network details.

#### `POST /api/v1/reports`

Requirements: - Verify ownership of client group and included
websites. - Validate requested date range. - Create random share token
and store only its hash. - Support expiration and revocation. - Return
the share URL once at creation.

#### `POST /api/v1/billing/checkout`

Requirements: - Authenticated user. - Resolve plan and price from
server-side configuration. - Never trust client-supplied amount or plan
entitlement. - Return provider checkout URL. - Subscription activation
must occur only after verified provider confirmation.

------------------------------------------------------------------------

## 9. GitHub milestones and issue breakdown

Use the issue IDs below as stable identifiers. Each issue should have a
clear objective, scope, acceptance criteria, tests, dependencies, and
implementation notes.

### M1 --- Foundation (Days 1--4)

#### SC-001 --- Initialise pnpm monorepo

-   Create pnpm workspace.
-   Add `apps/web` and `apps/worker`.
-   Create shared package placeholders.
-   Configure TypeScript strict mode.
-   Configure linting and formatting.
-   Add environment validation.
-   Add root scripts.
-   **Acceptance:** clean install, lint, typecheck, and build commands
    run successfully.

#### SC-002 --- PostgreSQL and Prisma foundation

-   Configure PostgreSQL connection.
-   Add Prisma schema and initial migration.
-   Add database package exports.
-   Add development seed strategy.
-   Add database health check.
-   **Acceptance:** migration applies to a clean database and
    application can connect.

#### SC-003 --- Authentication

-   Integrate Auth.js.
-   Implement registration and email verification flow.
-   Configure secure sessions and protected routes.
-   Decide and document authentication strategy.
-   Add tests for registration, login/session, and protected pages.
-   **Acceptance:** unverified users cannot access persistent monitoring
    features.

#### SC-004 --- Shared API conventions

-   Add shared Zod schemas.
-   Add standard success/error envelopes.
-   Add typed application errors.
-   Add structured logging and request IDs.
-   **Acceptance:** API routes use shared validation and response
    conventions.

#### SC-005 --- URL and network security

-   Implement URL parsing and normalisation.
-   Block private, loopback, link-local, multicast, and reserved
    IPv4/IPv6 ranges.
-   Validate DNS answers and actual connected destination.
-   Revalidate redirect destinations.
-   Add connection/total timeouts and response-size limits.
-   **Acceptance:** automated SSRF and redirect tests pass, including
    DNS rebinding-oriented cases.

### M2 --- Monitoring engine (Days 5--10)

#### SC-006 --- Website CRUD and ownership

-   Create website model and endpoints.
-   Add ownership enforcement.
-   Add plan-based website limits.
-   Add URL normalisation and pause/resume.
-   **Acceptance:** users cannot access or modify another user's
    websites.

#### SC-007 --- HTTP monitoring

-   Implement HTTP/HTTPS checks.
-   Record status code, response time, final URL, timestamp, and safe
    error category.
-   Handle DNS errors, TLS errors, timeouts, and HTTP failures.
-   **Acceptance:** tests cover successful responses, non-2xx responses,
    DNS failures, and timeouts.

#### SC-008 --- pg-boss queue and worker

-   Configure pg-boss.
-   Create worker process.
-   Add job handlers, retries, and idempotency.
-   Handle graceful shutdown and restart recovery.
-   **Acceptance:** worker restart does not lose queued work or create
    duplicate side effects.

#### SC-009 --- Monitoring scheduler

-   Find due websites and enqueue checks.
-   Respect paused state and plan interval.
-   Prevent duplicate scheduling.
-   Avoid overlapping checks for the same website where inappropriate.
-   **Acceptance:** scheduler reliably queues due checks without runaway
    duplication.

#### SC-010 --- Incident state engine

-   Define consecutive failure and success thresholds.
-   Open an incident after the failure threshold.
-   Close the incident after the recovery threshold.
-   Prevent duplicate open incidents under concurrency.
-   **Acceptance:** outage and recovery tests pass, including concurrent
    job execution.

#### SC-011 --- Monitoring history and uptime

-   Persist check history.
-   Add pagination and retention rules.
-   Calculate uptime with explicit missing-observation handling.
-   Implement plan-based history retention.
-   **Acceptance:** reports do not count missing checks as successful
    checks.

### M3 --- Website care (Days 11--15)

#### SC-012 --- SSL certificate monitoring

-   Inspect certificate chain and validity.
-   Validate hostname/SNI.
-   Record issuer, validity dates, and expiry.
-   Generate configurable expiry warning states.
-   **Acceptance:** valid, expired, hostname-mismatch, and
    connection-error cases are tested.

#### SC-013 --- Notification preferences

-   Add outage, recovery, SSL, and weekly-summary preferences.
-   Add user-level notification settings.
-   **Acceptance:** disabled notification categories are not sent.

#### SC-014 --- Transactional email system

-   Create provider-agnostic email interface.
-   Add templates for outage, recovery, SSL expiry, and weekly summary.
-   Queue delivery and retry transient failures.
-   Deduplicate repeated notifications.
-   **Acceptance:** provider failures do not block monitoring jobs.

#### SC-015 --- Main dashboard

-   Build dashboard from real database data.
-   Add loading, empty, error, and populated states.
-   Show website health and current incidents.
-   **Acceptance:** no mocked production dashboard metrics.

#### SC-016 --- Website detail page

-   Show monitoring history and incident timeline.
-   Show SSL details.
-   Add pause/resume and manual check controls.
-   **Acceptance:** controls enforce ownership and rate limits.

### M4 --- Agency features (Days 16--20)

#### SC-017 --- Client groups

-   Create, update, and delete client groups.
-   Assign and unassign websites.
-   Enforce group ownership.
-   **Acceptance:** cross-account group and website assignment tests
    pass.

#### SC-018 --- Agency client dashboard

-   Show client-level website health.
-   Show incidents and SSL warnings.
-   Add filters and useful status summaries.
-   **Acceptance:** all displayed metrics come from actual monitoring
    records.

#### SC-019 --- Client health reports

-   Generate report for a client group and date range.
-   Include uptime, incidents, and SSL status.
-   Generate secure share token.
-   Support expiry and revocation.
-   **Acceptance:** token is not stored in plaintext and revoked/expired
    links stop working.

#### SC-020 --- Public report pages

-   Render shareable report without requiring client login.
-   Expose only report-approved information.
-   Add appropriate no-index policy where needed.
-   **Acceptance:** no private account or unrelated client data is
    exposed.

### M5 --- Monetisation (Days 19--22)

#### SC-021 --- Subscription entitlement service

-   Centralise plan definitions and limits.
-   Enforce website count, check interval, retention, and report
    capabilities.
-   Handle downgrade without silently deleting data.
-   **Acceptance:** entitlement tests cover Free, Starter, Agency, and
    downgrade cases.

#### SC-022 --- Checkout integration

-   Implement one payment provider behind an adapter.
-   Resolve price and plan server-side.
-   Create checkout session.
-   Handle success/cancel return URLs.
-   **Acceptance:** browser return alone cannot activate a subscription.

#### SC-023 --- Verified billing webhooks

-   Verify webhook signatures.
-   Store provider event IDs uniquely.
-   Process events idempotently.
-   Handle successful payment, renewal, failure, and cancellation.
-   **Acceptance:** duplicate and invalid webhook tests pass.

#### SC-024 --- Pricing and billing interface

-   Display plans and current subscription.
-   Show usage and limits.
-   Add upgrade and cancellation flows.
-   **Acceptance:** UI reflects authoritative server-side subscription
    state.

### M6 --- Public tools and SEO (Days 23--25)

#### SC-025 --- Website status checker

-   Build public status checker page and endpoint.
-   Reuse hardened monitoring implementation.
-   Add rate limits and bounded resource usage.
-   Display useful diagnostic result.
-   **Acceptance:** anonymous endpoint passes SSRF tests.

#### SC-026 --- SSL checker

-   Build public SSL checker.
-   Display certificate validity, hostname match, issuer, and expiry.
-   Reuse hardened TLS inspection.
-   **Acceptance:** public checker does not expose internal network
    details.

#### SC-027 --- DNS checker

-   Support A, AAAA, MX, TXT, CNAME, and NS lookups.
-   Validate domain input.
-   Limit record counts and response time.
-   **Acceptance:** errors and empty results are clearly distinguished.

#### SC-028 --- Redirect checker

-   Execute redirect chain with strict hop limit.
-   Revalidate every destination.
-   Display status and destination per hop.
-   **Acceptance:** redirect loops and redirects to private IPs are
    blocked.

#### SC-029 --- SEO foundations

-   Add metadata, canonical URLs, sitemap, robots, and Open Graph.
-   Add original educational content to tool pages.
-   Add Search Console setup instructions.
-   Avoid thin or duplicate programmatic pages.
-   **Acceptance:** public pages are crawlable and technically sound.

### M7 --- Production hardening (Days 26--28)

#### SC-030 --- Security and reliability test suite

-   Test SSRF, redirects, DNS rebinding defenses, ownership, incident
    concurrency, subscription enforcement, and webhook idempotency.
-   Add rate-limit tests.
-   **Acceptance:** all critical security tests pass before launch.

#### SC-031 --- VPS deployment

-   Configure Ubuntu server.
-   Configure Nginx and TLS.
-   Run web and worker as separate PM2 processes.
-   Configure environment secrets.
-   Add GitHub Actions deployment workflow.
-   Run Prisma migrations safely.
-   Document rollback.
-   **Acceptance:** deployment and restart procedures are repeatable.

#### SC-032 --- Backups and observability

-   Configure off-server database backups.
-   Test restore.
-   Monitor web and worker processes.
-   Monitor queue backlog and failed jobs.
-   Add error tracking and operational alerts.
-   **Acceptance:** a documented restore test has been completed.

#### SC-033 --- End-to-end QA

-   Test signup and verification.
-   Test website registration and monitoring.
-   Test outage and recovery.
-   Test SSL warnings.
-   Test client groups and reports.
-   Test checkout and webhook confirmation.
-   Test responsive layouts.
-   **Acceptance:** critical user journeys pass on desktop and mobile.

### M8 --- Launch (Days 29--30)

#### SC-034 --- Beta onboarding

-   Invite a small group of freelancers/agencies.
-   Collect usability and reliability feedback.
-   Fix critical bugs.
-   Validate pricing assumptions.
-   **Acceptance:** beta feedback is documented and launch blockers are
    resolved.

#### SC-035 --- Production launch

-   Publish public tools and pricing.
-   Publish privacy, terms, and contact pages.
-   Submit sitemap and configure Search Console.
-   Verify email delivery and payment webhooks.
-   Confirm monitoring and backup alerts.
-   **Acceptance:** production smoke tests pass and support/contact path
    is available.

------------------------------------------------------------------------

## 10. Test catalogue

At minimum, implement the following test cases.

### Authentication

1.  Successful account registration.
2.  Duplicate email registration is rejected.
3.  Unverified account cannot use protected monitoring features.
4.  Protected route rejects unauthenticated request.

### URL and SSRF security

5.  Valid public HTTPS URL is accepted.
6.  Invalid URL is rejected.
7.  Localhost URL is rejected.
8.  Private IPv4 destination is rejected.
9.  Loopback and link-local IPv6 destinations are rejected.
10. Public hostname resolving to a private address is rejected.
11. Redirect to private address is rejected.
12. Redirect loop is bounded and reported safely.
13. DNS rebinding-oriented connection test confirms the actual
    destination is constrained.
14. Response-size and timeout limits are enforced.

### Monitoring

15. Successful HTTP response is recorded.
16. HTTP 500 response is recorded as a failed/degraded check according
    to policy.
17. DNS failure is recorded with a safe error category.
18. Timeout is recorded.
19. Consecutive failures open one incident.
20. Consecutive successes close the incident.
21. Concurrent checks do not create duplicate open incidents.
22. Paused website is not scheduled.
23. Manual check is rate-limited.
24. Worker restart recovers queued work.

### SSL and notifications

25. Valid SSL certificate is recognised.
26. Expired certificate is detected.
27. Hostname mismatch is detected.
28. Notification preferences are respected.
29. Duplicate outage notifications are suppressed.
30. Transient email provider failure is retried.

### Ownership and agency

31. User cannot read another user's website.
32. User cannot update another user's client group.
33. Website cannot be assigned to another user's group.
34. Report token works before expiry.
35. Expired report token is rejected.
36. Revoked report token is rejected.
37. Public report does not expose private account information.

### Billing and operations

38. Free plan website limit is enforced.
39. Downgrade does not silently delete websites.
40. Invalid webhook signature is rejected.
41. Duplicate webhook event is processed once.
42. Subscription activates only after verified provider confirmation.
43. Rate limits apply to anonymous tools.
44. Retention cleanup respects plan and retention rules.
45. Database backup can be restored successfully.

------------------------------------------------------------------------

## 11. Root scripts and developer workflow

Recommended root scripts:

``` json
{
  "scripts": {
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test",
    "test:unit": "pnpm -r test:unit",
    "test:integration": "pnpm -r test:integration",
    "test:e2e": "pnpm -r test:e2e",
    "build": "pnpm -r build",
    "db:generate": "pnpm --filter @sitecare/database db:generate",
    "db:migrate": "pnpm --filter @sitecare/database db:migrate"
  }
}
```

Adjust commands to match the actual workspace package names and scripts.
Do not leave scripts that appear to pass while skipping tests.

### Branch strategy

Use one feature branch per issue:

``` text
feat/SC-001-monorepo-setup
feat/SC-002-database-prisma
feat/SC-005-url-network-security
```

### Commit conventions

``` text
feat(monitoring): implement HTTP checks
fix(security): validate redirect destinations
test(billing): cover webhook idempotency
chore(infra): configure worker process
```

### Pull request workflow

1.  Create issue branch.
2.  Implement only the scoped issue.
3.  Run relevant tests.
4.  Run lint, typecheck, and build.
5.  Review security implications.
6.  Open PR and link issue.
7.  Review and merge.
8.  Start the next dependent issue only after checkpoint review.

------------------------------------------------------------------------

## 12. Kiro steering documents

Create these files before asking Kiro to implement the product.

### `.kiro/steering/product.md`

``` markdown
# SiteCare Product Steering

SiteCare is a website-care platform for freelancers and small web agencies.

The core value is operational website monitoring and client management:
- Uptime and HTTP response-time monitoring.
- SSL validity and expiry monitoring.
- Outage and recovery alerts.
- Client groups and multi-client dashboards.
- Shareable client health reports.
- Public diagnostic tools for organic acquisition.

SiteCare is not an AI wrapper. Prioritise real network diagnostics, scheduled checks,
incident detection, useful reporting, and reliable workflows.

MVP priorities:
1. Secure website monitoring.
2. Accurate incident detection and recovery.
3. SSL monitoring and email alerts.
4. Agency client groups and reports.
5. Server-enforced subscriptions.
6. Public status, SSL, DNS, and redirect tools.

Do not expand scope without explicit approval. Prefer a reliable, small release over
a broad but unreliable feature set.
```

### `.kiro/steering/architecture.md`

``` markdown
# SiteCare Architecture Steering

Stack:
- Next.js and TypeScript strict mode.
- PostgreSQL and Prisma.
- Auth.js.
- pg-boss.
- Separate Node.js worker process.
- Zod.
- pnpm workspaces.

Keep web and worker processes separate. Use pg-boss for scheduled monitoring,
incident evaluation, notifications, reports, and retention jobs.

Do not introduce Redis, Kubernetes, or microservices in the MVP without a measured
technical requirement.

Use explicit Prisma migrations in production. Do not use `prisma db push` in production.

All dashboard metrics must come from real persisted monitoring data. Handle missing
observations explicitly in uptime calculations.

Enforce ownership and subscription entitlements on the server.
```

### `.kiro/steering/security.md`

``` markdown
# SiteCare Security Steering

User-supplied URLs are untrusted input.

SSRF protections must:
- Reject private, loopback, link-local, multicast, reserved IPv4 and IPv6 destinations.
- Resolve and inspect DNS results.
- Constrain the actual network connection to validated destinations.
- Defend against DNS rebinding.
- Revalidate every redirect destination.
- Bound redirect count, timeouts, and response size.
- Avoid forwarding cookies, credentials, and authorization headers.
- Avoid disclosing private IPs in public responses.

Authentication:
- Verify ownership on every resource operation.
- Use secure sessions and cookies.
- Rate-limit sensitive endpoints.
- Never log secrets.

Billing:
- Resolve plan and price server-side.
- Verify webhook signatures.
- Process webhook event IDs idempotently.
- Never activate subscriptions based only on browser redirects.

Reports:
- Use cryptographically random tokens.
- Store token hashes, not plaintext tokens.
- Support expiry and revocation.
- Expose only explicitly approved report data.
```

------------------------------------------------------------------------

## 13. Kiro implementation prompts

Use one prompt at a time. Kiro must inspect the repository and steering
documents before changing code.

### Prompt 1 --- Project analysis and setup (SC-001)

``` text
You are implementing SiteCare, a production-minded website monitoring and agency
website-care platform.

First inspect the repository, package manager, existing code, and all files under
.kiro/steering/. Do not overwrite existing work without explaining why.

Implement GitHub issue SC-001 only:
- Initialise the pnpm monorepo.
- Create apps/web and apps/worker.
- Create the shared package structure.
- Configure TypeScript strict mode, linting, formatting, and environment validation.
- Add root scripts for lint, typecheck, test, build, and database commands.

Keep the implementation minimal and maintainable. Do not add Redis, Kubernetes,
microservices, or unrelated features.

Run the relevant commands and report exact outcomes. Do not claim a command passed
unless you executed it.

Finish with a checkpoint report: issue, acceptance criteria, changed files,
commands run, exact test results, known limitations, and commit/branch recommendation.
Do not start SC-002.
```

### Prompt 2 --- Database and authentication (SC-002 to SC-004)

``` text
Read the SiteCare steering files and inspect the existing implementation.

Implement only SC-002, SC-003, and SC-004, respecting issue dependencies:
- PostgreSQL and Prisma foundation.
- Auth.js authentication and email verification.
- Shared Zod schemas, API response envelopes, typed errors, and structured logging.

Before implementing authentication, explicitly identify the selected Auth.js strategy
and whether the Prisma adapter is appropriate. Include all required adapter models
if used. Do not mix incompatible Credentials and adapter assumptions.

Use explicit migrations. Do not use prisma db push for production.
Add tests for registration, duplicate email, verification, sessions, protected routes,
and API validation.

Do not implement monitoring yet. Run tests, lint, typecheck, and build. Report exact
results and stop for review.
```

### Prompt 3 --- Secure monitoring engine (SC-005 to SC-011)

``` text
Implement SiteCare issues SC-005 through SC-011 only.

Priorities:
- SSRF-safe URL validation and network connection handling.
- HTTP monitoring.
- pg-boss worker and retries.
- Scheduler and duplicate scheduling prevention.
- Consecutive-failure incident creation and recovery.
- Monitoring history and honest uptime calculations.

Critical SSRF requirement: do not rely on a DNS lookup followed by an unrestricted
fetch. Constrain the actual connection to validated public IP addresses and preserve
correct Host and TLS SNI behaviour. Revalidate every redirect destination.

Bound connection time, total time, response bytes, and redirect count. Never forward
user credentials or cookies. Do not expose private IP details in public responses.

Make incident creation concurrency-safe. Missing monitoring observations must not
be silently counted as healthy uptime.

Add unit and integration tests for successful checks, HTTP failures, DNS errors,
timeouts, private addresses, redirect attacks, DNS rebinding-oriented cases,
incident thresholds, recovery, concurrency, scheduler duplication, and worker restart.

Do not implement SSL, notifications, dashboard, or billing in this task.
Run all relevant checks and provide a detailed checkpoint report. Stop for review.
```

### Prompt 4 --- SSL and notification system (SC-012 to SC-014)

``` text
Implement SiteCare issues SC-012, SC-013, and SC-014 only.

Build SSL certificate inspection with correct hostname validation and SNI.
Record certificate issuer, validity period, and expiry state.

Build notification preferences for outage, recovery, SSL warnings, and weekly
summaries. Implement a provider-agnostic email interface with templates, queued
delivery, retries, and deduplication.

Email provider failure must not block monitoring jobs. Do not hardcode secrets.
Add tests for valid, expired, and hostname-mismatched certificates, disabled
preferences, duplicate notification suppression, and provider retry behaviour.

Do not build dashboard or agency functionality yet. Run tests and report exact
results. Stop for review.
```

### Prompt 5 --- Dashboard and agency functionality (SC-015 to SC-018)

``` text
Implement SiteCare issues SC-015 through SC-018 only.

Build a polished, responsive dashboard using real database and monitoring data.
Include loading, empty, error, and populated states. Build website detail views with
history, incident timeline, SSL details, pause/resume, and manual check controls.

Implement client groups and website assignment with strict ownership enforcement.
Build a client-level health dashboard with incident and SSL warning filters.

Design should feel professional and intentional, not like a generic admin template.
Avoid fake charts, fake metrics, and mocked production data.

Add ownership and integration tests. Ensure all actions enforce plan limits and
rate limits where applicable. Do not implement reports or billing yet.

Run checks and provide a checkpoint report. Stop for review.
```

### Prompt 6 --- Reports and billing (SC-019 to SC-024)

``` text
Implement SiteCare issues SC-019 through SC-024 only.

Reports:
- Generate client health reports for validated date ranges.
- Include uptime, incidents, and SSL state.
- Use cryptographically random share tokens and store only token hashes.
- Support expiry and revocation.
- Expose only approved client-facing information.

Billing:
- Create a central server-side entitlement service.
- Implement one payment provider behind an adapter.
- Resolve plan and price server-side.
- Verify webhook signatures and enforce event idempotency.
- Handle success, renewal, failure, and cancellation.
- Never activate a subscription from a browser redirect alone.
- Never silently delete websites on downgrade.

The initial Free, Starter, and Agency plan values are hypotheses. Keep plan configuration
centralised so prices and limits can be changed without rewriting feature logic.
Do not assume one-minute monitoring is viable without capacity testing.

Add tests for report token security, expiry, revocation, cross-account access,
entitlement limits, downgrade behaviour, invalid webhook signatures, duplicate
webhooks, and subscription state transitions.

The payment provider has not been fixed by the product brief. If no provider has been
selected in the repository, create a clean provider interface and document the
integration decision required; do not invent provider-specific credentials or APIs.

Run all relevant checks and stop for review.
```

### Prompt 7 --- Public tools and SEO (SC-025 to SC-029)

``` text
Implement SiteCare issues SC-025 through SC-029 only.

Public tools:
1. Website status checker.
2. SSL checker.
3. DNS checker for A, AAAA, MX, TXT, CNAME, and NS.
4. Redirect checker.

Reuse the secure diagnostic implementation. Anonymous tools require strict rate
limits, bounded execution, SSRF protection, redirect revalidation, and safe output.
Never expose internal/private IP information.

Create useful public pages:
- /tools/website-status-checker
- /tools/ssl-checker
- /tools/dns-checker
- /tools/redirect-checker

Add original explanations, meaningful result presentation, metadata, canonical URLs,
sitemap, robots, and Open Graph metadata. Avoid thin, duplicated, programmatic SEO
pages. Keep ads off authenticated dashboard pages.

Add tests for each tool and its security constraints. Run checks and stop for review.
```

### Prompt 8 --- Production readiness and launch (SC-030 to SC-035)

``` text
Prepare SiteCare for production by implementing issues SC-030 through SC-035.

Priorities:
- Security regression suite.
- Ubuntu VPS deployment.
- Nginx and TLS.
- Separate PM2 web and worker processes.
- GitHub Actions deployment.
- Safe Prisma migrations and rollback documentation.
- Off-server backups and a tested restore.
- Queue and worker observability.
- End-to-end QA.
- Beta onboarding and launch checklist.

Do not claim production readiness if backups have not been restored in a test,
critical SSRF tests are missing, webhook verification is incomplete, or monitoring
incident tests fail.

Run lint, typecheck, unit, integration, E2E, and production build. Report exact
commands and results. List any skipped tests and why.

Provide deployment, rollback, backup, restore, and post-deployment smoke-test
instructions. Do not conceal known limitations.
```

------------------------------------------------------------------------

## 14. GitHub issue template

Create `.github/ISSUE_TEMPLATE/feature.yml`:

``` yaml
name: Feature
description: Track a SiteCare implementation issue
title: "[SC-XXX] "
labels:
  - feature
body:
  - type: textarea
    id: objective
    attributes:
      label: Objective
      description: What outcome should this issue deliver?
    validations:
      required: true
  - type: textarea
    id: scope
    attributes:
      label: Scope
      description: List the work included in this issue.
    validations:
      required: true
  - type: textarea
    id: acceptance
    attributes:
      label: Acceptance criteria
      description: Define observable completion criteria.
    validations:
      required: true
  - type: textarea
    id: tests
    attributes:
      label: Tests
      description: What tests must be added or updated?
    validations:
      required: true
  - type: textarea
    id: dependencies
    attributes:
      label: Dependencies
      description: Related issues or prerequisites.
  - type: textarea
    id: notes
    attributes:
      label: Implementation notes
      description: Security, migration, API, or operational considerations.
```

------------------------------------------------------------------------

## 15. Mandatory implementation checkpoint

After each issue, the coding agent must provide:

``` text
## Implementation checkpoint

Issue:
Branch:
Commit:

### Acceptance criteria
- [ ] Criterion 1
- [ ] Criterion 2

### Changed files
- List files and why they changed.

### Database
- Migrations added or changed.
- Migration execution result.

### API
- Endpoints added or changed.
- Authentication and ownership checks.

### Tests
- Tests added.
- Exact commands executed.
- Exact pass/fail/skip counts.

### Quality checks
- Lint:
- Typecheck:
- Build:

### Security review
- Input validation:
- Ownership:
- SSRF/network safety:
- Rate limits:
- Secrets/logging:

### Known issues
- Remaining bugs or limitations.
- Follow-up issues required.

### Git
- Branch:
- Commit hash:
- PR:
```

Do not begin the next issue until the checkpoint has been reviewed.

------------------------------------------------------------------------

## 16. Release checklist

### Foundation

-   [ ] pnpm workspace installs cleanly.
-   [ ] Web and worker run as separate processes.
-   [ ] Production migrations are documented and tested.
-   [ ] Authentication and email verification work.
-   [ ] Environment secrets are not committed.

### Monitoring

-   [ ] HTTP checks work for public websites.
-   [ ] Timeouts and failures are classified safely.
-   [ ] SSRF protections pass automated tests.
-   [ ] Redirect destinations are revalidated.
-   [ ] Incident thresholds work.
-   [ ] Recovery closes incidents correctly.
-   [ ] Monitoring history and uptime calculations handle missing data.
-   [ ] Paused websites are not checked.

### SSL and notifications

-   [ ] SSL hostname validation works.
-   [ ] Expiry warnings work.
-   [ ] Outage and recovery emails work.
-   [ ] Notification preferences are respected.
-   [ ] Email retries and deduplication work.

### Agency features

-   [ ] Client groups work.
-   [ ] Websites can be assigned to clients.
-   [ ] Cross-account access is blocked.
-   [ ] Reports contain only approved data.
-   [ ] Report links can expire and be revoked.

### Billing

-   [ ] Plans and limits are enforced server-side.
-   [ ] Checkout uses server-resolved prices.
-   [ ] Webhook signatures are verified.
-   [ ] Webhook processing is idempotent.
-   [ ] Downgrade does not silently delete user data.

### Public tools and SEO

-   [ ] Website status checker works.
-   [ ] SSL checker works.
-   [ ] DNS checker works.
-   [ ] Redirect checker works.
-   [ ] Public tools are rate-limited.
-   [ ] Tool pages have original useful content.
-   [ ] Metadata, canonical URLs, sitemap, and robots are correct.
-   [ ] No ads appear inside authenticated dashboard pages.

### Infrastructure

-   [ ] Nginx and TLS are configured.
-   [ ] Web and worker run separately under process supervision.
-   [ ] Deployment workflow is tested.
-   [ ] Queue backlog and worker failures are observable.
-   [ ] Off-server backups are running.
-   [ ] A database restore has been tested.
-   [ ] Rollback procedure is documented.

### Launch

-   [ ] Critical end-to-end journeys pass.
-   [ ] Mobile layouts have been checked.
-   [ ] Privacy policy and terms are published.
-   [ ] Contact/support route is available.
-   [ ] Beta feedback has been reviewed.
-   [ ] Production smoke tests pass.
-   [ ] Search Console and sitemap submission are complete.

------------------------------------------------------------------------

## 17. Important decisions still to confirm

The following decisions should be made before the corresponding
implementation issues begin:

1.  **Payment provider:** Select a provider that supports the intended
    business location, international subscriptions, recurring billing,
    and required currencies. Confirm current eligibility and fees from
    official provider documentation.
2.  **Authentication method:** Decide whether the product uses
    email/password, email OTP, OAuth, or a combination. Confirm the
    Auth.js adapter implications.
3.  **Email provider:** Choose a transactional email provider and verify
    sending limits, domain authentication, deliverability, and pricing.
4.  **Pricing and currency:** Validate the proposed \$5 and \$15 monthly
    plans with target agencies.
5.  **Monitoring intervals:** Measure actual worker and database
    capacity before offering one-minute checks.
6.  **Report branding:** Decide whether branded reports are an
    Agency-only entitlement or a later add-on.
7.  **Retention:** Confirm how long raw checks and incident records are
    retained and how deletion requests are handled.

------------------------------------------------------------------------

## 18. Recommended execution order

Follow dependencies rather than trying to implement all features in
parallel:

1.  SC-001 --- Monorepo.
2.  SC-002 --- Database.
3.  SC-003 --- Authentication.
4.  SC-004 --- Shared API conventions.
5.  SC-005 --- URL and network security.
6.  SC-006 to SC-011 --- Monitoring engine.
7.  SC-012 to SC-014 --- SSL and notifications.
8.  SC-015 to SC-018 --- Dashboard and client groups.
9.  SC-019 to SC-020 --- Reports.
10. SC-021 to SC-024 --- Billing.
11. SC-025 to SC-029 --- Public tools and SEO.
12. SC-030 to SC-033 --- Production hardening and QA.
13. SC-034 to SC-035 --- Beta and launch.

Some work can overlap after its dependencies are stable, but do not
parallelise changes to core database models, scheduler logic, or
incident state transitions without clear ownership and migration
coordination.

------------------------------------------------------------------------

## 19. Definition of a successful MVP

SiteCare is ready for its first public release when:

-   A verified user can register and monitor public websites.
-   Monitoring checks execute reliably in a separate worker.
-   Outages and recoveries are detected without duplicate incidents.
-   SSL validity and expiry are monitored.
-   Email alerts are delivered with retries and deduplication.
-   Users can group websites by client.
-   Users can create secure, revocable client reports.
-   Subscription limits are enforced on the server.
-   Public diagnostic tools operate safely under rate limits.
-   SSRF protections have passed meaningful automated tests.
-   Production backups have been restored successfully in a test.
-   Critical end-to-end flows pass.
-   The product has clear pricing, privacy, terms, and support
    information.

**Guiding principle:** launch a small, dependable website-care product
that agencies can trust. Expand only after real users demonstrate which
workflows they will pay to keep using.
