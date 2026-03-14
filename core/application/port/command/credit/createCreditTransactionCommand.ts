import { z } from "zod"

import { AppResult } from "@/core/util/appResult"

export const CreateCreditTransactionCommandParametersSchema = z.object({
  userId: z.string(),
  amount: z.number(),
  type: z.enum(['grant', 'usage']),
  operation: z.string().optional(),
})

export type CreateCreditTransactionCommandParametersInput = z.input<typeof CreateCreditTransactionCommandParametersSchema>

export type CreateCreditTransactionCommandParameters = z.infer<typeof CreateCreditTransactionCommandParametersSchema>

export type CreateCreditTransactionCommand = (parameters: CreateCreditTransactionCommandParametersInput) => Promise<AppResult<void>>
