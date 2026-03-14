export type InvalidParametersError = {
  type: "InvalidParametersError"
  message: string
  cause?: unknown
}

export type NotFoundError = {
  type: "NotFoundError"
  message: string
  cause?: unknown
}

export type ForbiddenError = {
  type: "ForbiddenError"
  message: string
  cause?: unknown
}

export type InternalServerError = {
  type: "InternalServerError"
  message: string
  cause?: unknown
}

export type ExternalServiceError = {
  type: "ExternalServiceError"
  message: string
  cause?: unknown
}

export type ConflictError = {
  type: "ConflictError"
  message: string
  cause?: unknown
}

export type InsufficientCreditsError = {
  type: "InsufficientCreditsError"
  message: string
  cause?: unknown
}

export type AppError = InvalidParametersError | NotFoundError | ForbiddenError | InternalServerError | ExternalServiceError | ConflictError | InsufficientCreditsError
