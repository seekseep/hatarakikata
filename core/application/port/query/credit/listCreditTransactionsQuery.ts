import { z } from "zod"

import { AppResult } from "@/core/util/appResult"

export const CreditTransactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  type: z.enum(['grant', 'usage']),
  operation: z.string().nullable(),
  createdAt: z.string(),
})

export type CreditTransaction = z.infer<typeof CreditTransactionSchema>

export const ListCreditTransactionsQueryParametersSchema = z.object({
  userId: z.string(),
})

export type ListCreditTransactionsQueryParametersInput = z.input<typeof ListCreditTransactionsQueryParametersSchema>

export type ListCreditTransactionsQuery = (parameters: ListCreditTransactionsQueryParametersInput) => Promise<AppResult<CreditTransaction[]>>
