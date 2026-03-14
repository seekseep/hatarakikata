import { AppError, ConflictError, ExternalServiceError, ForbiddenError, InsufficientCreditsError, InternalServerError, InvalidParametersError, NotFoundError } from '@/core/error/appError'

import { AppResult } from './types'

export * from './types'

export function fail<T>(error: AppError): AppResult<T> {
  return {
    success: false,
    error,
  }
}

export function succeed<T>(data: T): AppResult<T> {
  return {
    success: true,
    data,
  }
}

export function failAsInvalidParametersError<T>(message: string, cause?: unknown): AppResult<T> {
  return fail<T>({ type: "InvalidParametersError", message, cause } satisfies InvalidParametersError)
}

export function failAsNotFoundError<T>(message: string, cause?: unknown): AppResult<T> {
  return fail<T>({ type: "NotFoundError", message, cause } satisfies NotFoundError)
}

export function failAsForbiddenError<T>(message: string, cause?: unknown): AppResult<T> {
  return fail<T>({ type: "ForbiddenError", message, cause } satisfies ForbiddenError)
}

export function failAsInternalServerError<T>(message: string, cause?: unknown): AppResult<T> {
  return fail<T>({ type: "InternalServerError", message, cause } satisfies InternalServerError)
}

export function failAsExternalServiceError<T>(message: string, cause?: unknown): AppResult<T> {
  return fail<T>({ type: "ExternalServiceError", message, cause } satisfies ExternalServiceError)
}

export function failAsConflictError<T>(message: string, cause?: unknown): AppResult<T> {
  return fail<T>({ type: "ConflictError", message, cause } satisfies ConflictError)
}

export function failAsInsufficientCreditsError<T>(message: string, cause?: unknown): AppResult<T> {
  return fail<T>({ type: "InsufficientCreditsError", message, cause } satisfies InsufficientCreditsError)
}
