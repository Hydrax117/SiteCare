/**
 * Worker environment validation. Called once at startup.
 */

import { validateEnv, baseEnvSchema } from '@sitecare/shared';

export const env = validateEnv(baseEnvSchema);
export type WorkerEnv = typeof env;
