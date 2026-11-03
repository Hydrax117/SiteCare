/**
 * SiteCare Worker process entry point.
 *
 * This process MUST run separately from the web application.
 * Starting this process inside the Next.js server will create duplicate
 * scheduler instances and duplicate monitoring jobs.
 *
 * Responsibilities:
 * - Scheduled website checks
 * - HTTP and SSL monitoring
 * - Incident evaluation
 * - Email delivery
 * - Report generation
 * - History retention and cleanup
 *
 * Implemented progressively from SC-008 onward.
 */

import './env.js'; // validate environment at startup
import { logger } from '@sitecare/shared';

async function start(): Promise<void> {
  logger.info('SiteCare worker starting', { version: '0.0.1' });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`Worker received ${signal}, shutting down gracefully`);
    // Queue and DB teardown will be added in SC-008
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  logger.info('Worker ready — job handlers will be registered in SC-008');

  // Keep the process alive until a signal is received
  await new Promise<void>(() => {
    // Intentionally never resolves — the process runs until shutdown signal
  });
}

start().catch((err: unknown) => {
  logger.error('Worker failed to start', {
    error: err instanceof Error ? err.message : String(err),
  });
  process.exit(1);
});
