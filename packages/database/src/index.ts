/**
 * Database package entry point.
 * Exports the Prisma client singleton and all Prisma types.
 */

export { prisma, checkDatabaseHealth } from './client.js';
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
