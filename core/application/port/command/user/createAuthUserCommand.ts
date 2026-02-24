import type { AppResult } from "@/core/util/appResult"

export type CreateAuthUserCommandParameters = {
  email: string
  password: string
}

export type CreateAuthUserCommandResult = {
  id: string
}

export type CreateAuthUserCommand = (
  parameters: CreateAuthUserCommandParameters
) => Promise<AppResult<CreateAuthUserCommandResult>>
