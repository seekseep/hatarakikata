import { z } from "zod"

import type { AppResult } from "@/core/util/appResult"

export const DeleteAuthUserByEmailCommandParametersSchema = z.object({
  email: z.string(),
})

export type DeleteAuthUserByEmailCommandParametersInput = z.input<typeof DeleteAuthUserByEmailCommandParametersSchema>

export type DeleteAuthUserByEmailCommandParameters = z.infer<typeof DeleteAuthUserByEmailCommandParametersSchema>

export type DeleteAuthUserByEmailCommand = (
  parameters: DeleteAuthUserByEmailCommandParametersInput
) => Promise<AppResult<void>>
