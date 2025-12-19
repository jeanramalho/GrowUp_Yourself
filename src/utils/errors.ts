/**
 * Application-wide Error Handling & Result Types
 * Provides consistent error handling across all layers
 */

/**
 * App Error Types
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE = 'DUPLICATE',
  DATABASE = 'DATABASE',
  PERMISSION = 'PERMISSION',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Standard Application Error
 */
export class AppError extends Error {
  constructor(
    public code: ErrorType,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Validation Error (specific error type)
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorType.VALIDATION, message, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with ID "${id}" not found` : `${resource} not found`;
    super(ErrorType.NOT_FOUND, message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Duplicate Error (e.g., unique constraint violation)
 */
export class DuplicateError extends AppError {
  constructor(resource: string, field: string, value: any) {
    super(
      ErrorType.DUPLICATE,
      `${resource} with ${field} "${value}" already exists`,
      409,
      { field, value },
    );
    this.name = 'DuplicateError';
  }
}

/**
 * Database Error
 */
export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(
      ErrorType.DATABASE,
      message,
      500,
      originalError ? { originalMessage: originalError.message } : undefined,
    );
    this.name = 'DatabaseError';
  }
}

/**
 * Result Type (Either pattern)
 * Used for explicit error handling
 */
export type Result<T> = Success<T> | Failure;

export class Success<T> {
  readonly isSuccess = true;
  readonly isFailure = false;

  constructor(readonly value: T) {}

  map<U>(fn: (value: T) => U): Result<U> {
    return new Success(fn(this.value));
  }

  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    return fn(this.value);
  }

  getOrElse(): T {
    return this.value;
  }

  getOrThrow(): T {
    return this.value;
  }
}

export class Failure {
  readonly isSuccess = false;
  readonly isFailure = true;

  constructor(readonly error: AppError) {}

  map<U>(): Result<U> {
    return this as any;
  }

  flatMap<U>(): Result<U> {
    return this as any;
  }

  getOrElse<T>(defaultValue: T): T {
    return defaultValue;
  }

  getOrThrow(): never {
    throw this.error;
  }
}

/**
 * Helper function to create success result
 */
export function ok<T>(value: T): Result<T> {
  return new Success(value);
}

/**
 * Helper function to create failure result
 */
export function fail(error: AppError): Failure {
  return new Failure(error);
}

/**
 * Async Result type
 */
export type AsyncResult<T> = Promise<Result<T>>;

/**
 * Type guards
 */
export function isSuccess<T>(result: Result<T>): result is Success<T> {
  return result.isSuccess;
}

export function isFailure<T>(result: Result<T>): result is Failure {
  return result.isFailure;
}

/**
 * Error logger utility
 */
export function logError(error: any, context: string = 'App'): void {
  if (error instanceof AppError) {
    console.error(`[${context}] ${error.name}: ${error.message}`, error.toJSON());
  } else if (error instanceof Error) {
    console.error(`[${context}] ${error.name}: ${error.message}`);
  } else {
    console.error(`[${context}] Unknown error:`, error);
  }
}
