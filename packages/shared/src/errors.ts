/**
 * Typed application errors for consistent error handling across the monorepo.
 */

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'UNAUTHORIZED'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'PLAN_LIMIT_EXCEEDED'
  | 'SSRF_BLOCKED'
  | 'INTERNAL_ERROR'
  | 'EXTERNAL_SERVICE_ERROR';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, details, 422);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super('NOT_FOUND', message, undefined, 404);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super('FORBIDDEN', message, undefined, 403);
    this.name = 'ForbiddenError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super('UNAUTHORIZED', message, undefined, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('CONFLICT', message, details, 409);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super('RATE_LIMITED', message, undefined, 429);
    this.name = 'RateLimitError';
  }
}

export class PlanLimitError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('PLAN_LIMIT_EXCEEDED', message, details, 403);
    this.name = 'PlanLimitError';
  }
}

export class SsrfBlockedError extends AppError {
  constructor(message = 'URL destination is not allowed') {
    // Never reveal which internal address was blocked
    super('SSRF_BLOCKED', message, undefined, 422);
    this.name = 'SsrfBlockedError';
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
