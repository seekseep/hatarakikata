import type { AppResult } from "@/core/util/appResult"

export type DeleteAuthUserByEmailCommandParameters = {
  email: string
}

export type DeleteAuthUserByEmailCommand = (
  parameters: DeleteAuthUserByEmailCommandParameters
) => Promise<AppResult<void>>
