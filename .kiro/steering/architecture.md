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
