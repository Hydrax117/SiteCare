/**
 * Database health check.
 * Used by API health endpoints and monitoring.
 */

import { prisma } from './client.js';

export interface HealthCheckResult {
  healthy: boolean;
  latencyMs: number;
  error?: string;
}

export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { healthy: true, latencyMs: Date.now() - start };
  } catch {
    return {
      healthy: false,
      latencyMs: Date.now() - start,
      // Do not expose raw connection details
      error: 'Database unreachable',
    };
  }
}
