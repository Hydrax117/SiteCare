/**
 * GET /api/health
 * Lightweight health check — confirms the web process and database are reachable.
 * Used by deployment tooling and uptime monitors.
 * Does not require authentication.
 */

import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@sitecare/database';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const db = await checkDatabaseHealth();

  const status = db.healthy ? 200 : 503;

  return NextResponse.json(
    {
      status: db.healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          healthy: db.healthy,
          latencyMs: db.latencyMs,
          ...(db.error ? { error: db.error } : {}),
        },
      },
    },
    { status }
  );
}
