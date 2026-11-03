/**
 * Environment variable validation using Zod.
 * Import and call validateEnv() once at process startup in each app.
 * Throws at startup if required variables are missing or malformed — fail fast.
 */

import { z } from 'zod';

/**
 * Parse and validate environment variables against a Zod schema.
 * Throws a descriptive error if validation fails.
 */
export function validateEnv<T extends z.ZodTypeAny>(schema: T): z.infer<T> {
  const result = schema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Environment validation failed:\n${formatted}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result.data as z.infer<T>;
}

/**
 * Base environment variables required by all apps.
 */
export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;
