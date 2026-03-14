import { z } from "zod"

import { AppResult } from "@/core/util/appResult"

export const GetCreditBalanceQueryParametersSchema = z.object({
  userId: z.string(),
})

export type GetCreditBalanceQueryParametersInput = z.input<typeof GetCreditBalanceQueryParametersSchema>

export type GetCreditBalanceQueryParameters = z.infer<typeof GetCreditBalanceQueryParametersSchema>

export type GetCreditBalanceQuery = (parameters: GetCreditBalanceQueryParametersInput) => Promise<AppResult<number>>
