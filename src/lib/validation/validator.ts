import { z, ZodError, ZodSchema } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data: T | null;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate data against a Zod schema.
 *
 * Services call this before accepting input.
 * On failure, throws a ValidationException (not a generic Error).
 *
 * Usage:
 *   const data = validate(ProductCreateSchema, rawInput);
 */
export function validate<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data, errors: [] };
  }

  const errors = formatZodErrors(result.error);
  return { success: false, data: null, errors };
}

/**
 * Like validate(), but throws ValidationException on failure.
 * Use this in services where you want to fail fast.
 */
export function validateOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = validate(schema, data);
  if (!result.success || result.data === null) {
    throw new ValidationException(result.errors);
  }
  return result.data;
}

/**
 * Validates and strips unknown fields (returns only schema-defined fields).
 * Safe for passing directly to repositories.
 */
export function parseStrict<T>(schema: ZodSchema<T>, data: unknown): T {
  return validateOrThrow(schema, data);
}

function formatZodErrors(error: ZodError): ValidationError[] {
  return error.issues.map(issue => ({
    field: issue.path.join('.') || '_root',
    message: issue.message,
  }));
}

/**
 * Thrown by validateOrThrow when validation fails.
 * Services catch this and return user-facing Arabic messages.
 */
export class ValidationException extends Error {
  readonly errors: ValidationError[];
  readonly isValidationError = true;

  constructor(errors: ValidationError[]) {
    super('Validation failed');
    this.name = 'ValidationException';
    this.errors = errors;
  }

  /** First error message — useful for simple toast display */
  get firstMessage(): string {
    return this.errors[0]?.message ?? 'خطأ في البيانات المدخلة';
  }

  /** All messages joined */
  get allMessages(): string {
    return this.errors.map(e => e.message).join(' — ');
  }
}

/** Type guard */
export function isValidationException(error: unknown): error is ValidationException {
  return error instanceof ValidationException ||
    (typeof error === 'object' && error !== null && 'isValidationError' in error);
}

// Re-export zod for convenience — schemas should import zod from here
export { z };
