/**
 * Web app environment validation.
 * Called once at module load; throws immediately if config is missing.
 */

import { validateEnv, baseEnvSchema } from '@sitecare/shared';
import { z } from 'zod';

const webEnvSchema = baseEnvSchema.extend({
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
  // Email provider (required for verification emails)
  EMAIL_FROM: z.string().email('EMAIL_FROM must be a valid email address'),
  EMAIL_SERVER_URL: z.string().optional(),
});

export const env = validateEnv(webEnvSchema);
export type WebEnv = typeof env;
