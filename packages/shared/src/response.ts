/**
 * Standard API response envelopes.
 * All API routes must return one of these shapes.
 */

import type { ErrorCode } from './errors.js';

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

export function ok<T>(data: T, meta?: Record<string, unknown>): SuccessResponse<T> {
  return { success: true, data, ...(meta !== undefined ? { meta } : {}) };
}

export function fail(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): ErrorResponse {
  return {
    success: false,
    error: { code, message, ...(details !== undefined ? { details } : {}) },
  };
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginatedMeta;
}

export function paginated<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): SuccessResponse<PaginatedData<T>> {
  return ok(
    { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
    { total }
  );
}
