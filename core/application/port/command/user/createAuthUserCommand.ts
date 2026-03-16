import { z } from "zod"

import type { AppResult } from "@/core/util/appResult"

export const CreateAuthUserCommandParametersSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export type CreateAuthUserCommandParametersInput = z.input<typeof CreateAuthUserCommandParametersSchema>

export type CreateAuthUserCommandParameters = z.infer<typeof CreateAuthUserCommandParametersSchema>

export const CreateAuthUserCommandResultSchema = z.object({
  id: z.string(),
})

export type CreateAuthUserCommandResult = z.infer<typeof CreateAuthUserCommandResultSchema>

export type CreateAuthUserCommand = (
  parameters: CreateAuthUserCommandParametersInput
) => Promise<AppResult<CreateAuthUserCommandResult>>
