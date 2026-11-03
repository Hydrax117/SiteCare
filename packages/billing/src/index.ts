/**
 * Billing package — entitlement service, payment provider adapter.
 * Plan definitions and limits live here so they can be changed in one place.
 * Implemented in SC-021, SC-022, SC-023.
 *
 * Note: Plan names mirror the Prisma enum but are redeclared here to avoid
 * a circular build-order dependency. They must stay in sync with the schema.
 */

export type Plan = 'FREE' | 'STARTER' | 'AGENCY';

export interface PlanLimits {
  maxWebsites: number;
  checkIntervalMs: number;
  historyRetentionDays: number;
  clientGroups: boolean;
  brandedReports: boolean;
  weeklySummary: boolean;
}

/**
 * Central plan definition — single source of truth for limits.
 * These are initial hypotheses; validate with real users before treating as final.
 */
export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    maxWebsites: 3,
    checkIntervalMs: 5 * 60 * 1000, // 5 minutes
    historyRetentionDays: 7,
    clientGroups: true,
    brandedReports: false,
    weeklySummary: false,
  },
  STARTER: {
    maxWebsites: 10,
    checkIntervalMs: 5 * 60 * 1000,
    historyRetentionDays: 30,
    clientGroups: true,
    brandedReports: false,
    weeklySummary: true,
  },
  AGENCY: {
    maxWebsites: 30,
    checkIntervalMs: 5 * 60 * 1000, // capacity-dependent; measure before reducing
    historyRetentionDays: 90,
    clientGroups: true,
    brandedReports: true,
    weeklySummary: true,
  },
} as const;

export function getPlanLimits(plan: Plan): PlanLimits {
  // Record<Plan, PlanLimits> with `as const` guarantees every key is defined
  return PLAN_LIMITS[plan];
}

/**
 * Prices in cents (USD). These are hypotheses — validate before treating as final.
 * Always resolve price server-side; never trust client-supplied amounts.
 */
export const PLAN_PRICES_CENTS: Record<Plan, number> = {
  FREE: 0,
  STARTER: 500,   // $5/month
  AGENCY: 1500,   // $15/month
} as const;

export function getPlanPrice(plan: Plan): number {
  return PLAN_PRICES_CENTS[plan];
}
