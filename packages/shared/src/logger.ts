/**
 * Structured logger.
 * Outputs JSON in production, human-readable in development.
 * Never log secrets, tokens, passwords, or payment credentials.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  requestId?: string;
  jobId?: string;
  userId?: string;
  websiteId?: string;
  [key: string]: unknown;
}

const IS_PROD = process.env['NODE_ENV'] === 'production';

function serialize(level: LogLevel, message: string, context?: LogContext): string {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  return JSON.stringify(entry);
}

function emit(level: LogLevel, message: string, context?: LogContext): void {
  const output = IS_PROD ? serialize(level, message, context) : formatDev(level, message, context);
  if (level === 'error' || level === 'warn') {
    console.error(output);
  } else {
    // eslint-disable-next-line no-console
    console.log(output);
  }
}

function formatDev(level: LogLevel, message: string, context?: LogContext): string {
  const prefix = `[${level.toUpperCase()}]`;
  const ctx = context ? ` ${JSON.stringify(context)}` : '';
  return `${prefix} ${message}${ctx}`;
}

export const logger = {
  debug: (message: string, context?: LogContext) => emit('debug', message, context),
  info: (message: string, context?: LogContext) => emit('info', message, context),
  warn: (message: string, context?: LogContext) => emit('warn', message, context),
  error: (message: string, context?: LogContext) => emit('error', message, context),
};

export type Logger = typeof logger;
