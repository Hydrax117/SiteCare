/**
 * Database package entry point.
 * Exports the Prisma client singleton, health check, and all Prisma types.
 */

export { prisma } from './client.js';
export { checkDatabaseHealth } from './health.js';
export type { HealthCheckResult } from './health.js';

export type {
  User,
  Account,
  Session,
  VerificationToken,
  Subscription,
  ClientGroup,
  Website,
  MonitorCheck,
  Incident,
  SslSnapshot,
  NotificationPreference,
  Report,
  PaymentEvent,
} from '@prisma/client';

export {
  Plan,
  SubscriptionStatus,
  WebsiteStatus,
  CheckResult,
  IncidentStatus,
  SslStatus,
  ReportStatus,
} from '@prisma/client';
