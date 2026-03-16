import { z } from "zod"

import { AiOperationNameSchema } from "@/core/application/config/creditCosts"
import { CREDIT_COSTS } from "@/core/application/config/creditCosts"
import type { CreateCreditTransactionCommandParameters } from "@/core/application/port/command/credit/createCreditTransactionCommand"
import { MembershipPlanSchema } from "@/core/application/port/query/membership/getMembershipQuery"
import { type AppResult, failAsInsufficientCreditsError, succeed } from "@/core/util/appResult"

export const ResolveCreditTransactionParametersSchema = z.object({
  userId: z.string(),
  plan: MembershipPlanSchema,
  operation: AiOperationNameSchema,
  balance: z.number(),
})

export type ResolveCreditTransactionParameters = z.infer<typeof ResolveCreditTransactionParametersSchema>

/**
 * メンバーシップと残高から、クレジット取引パラメータを決定する。
 * - premium: null を返す（クレジット不要）
 * - free + 残高十分: 取引パラメータを返す
 * - free + 残高不足: InsufficientCreditsError を返す
 */
export function resolveCreditTransaction(
  parameters: ResolveCreditTransactionParameters
): AppResult<CreateCreditTransactionCommandParameters | null> {
  if (parameters.plan !== 'free') {
    return succeed(null)
  }

  const cost = CREDIT_COSTS[parameters.operation]

  if (parameters.balance < cost) {
    return failAsInsufficientCreditsError("Insufficient credits")
  }

  return succeed({
    userId: parameters.userId,
    amount: cost,
    type: 'usage' as const,
    operation: parameters.operation,
  })
}
