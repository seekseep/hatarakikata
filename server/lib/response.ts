import { NextResponse } from 'next/server'

import type { AppResult } from '@/core/util/appResult'

export function toResponse<T>(result: AppResult<T>): NextResponse {
  if (result.success) {
    return NextResponse.json(result.data, { status: 200 })
  }

  const { error } = result
  const statusMap = {
    InvalidParametersError: 400,
    ForbiddenError: 403,
    NotFoundError: 404,
    ConflictError: 409,
    InternalServerError: 500,
    ExternalServiceError: 502,
  } as const

  if (error.cause) {
    console.error(error.cause)
  }

  const status = statusMap[error.type]

  const safeMessages: Record<string, string> = {
    InvalidParametersError: 'Invalid parameters',
    ForbiddenError: 'Forbidden',
    NotFoundError: 'Not found',
    ConflictError: 'Conflict',
    InternalServerError: 'Internal server error',
    ExternalServiceError: 'External service error',
  }

  return NextResponse.json({ error: safeMessages[error.type] ?? 'Unknown error' }, { status })
}
