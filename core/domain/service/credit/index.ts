import type { AiOperationName } from "@/core/application/config/creditCosts"
import { CREDIT_COSTS } from "@/core/application/config/creditCosts"
import type { CreateCreditTransactionCommandParameters } from "@/core/application/port/command/credit/createCreditTransactionCommand"
import type { MembershipPlan } from "@/core/application/port/query/membership/getMembershipQuery"
import { type AppResult, failAsInsufficientCreditsError, succeed } from "@/core/util/appResult"

export type ResolveCreditTransactionParams = {
  userId: string
  plan: MembershipPlan
  operation: AiOperationName
  balance: number
}

/**
 * メンバーシップと残高から、クレジット取引パラメータを決定する。
 * - premium: null を返す（クレジット不要）
 * - free + 残高十分: 取引パラメータを返す
 * - free + 残高不足: InsufficientCreditsError を返す
 */
export function resolveCreditTransaction(
  params: ResolveCreditTransactionParams
): AppResult<CreateCreditTransactionCommandParameters | null> {
  if (params.plan !== 'free') {
    return succeed(null)
  }

  const cost = CREDIT_COSTS[params.operation]

  if (params.balance < cost) {
    return failAsInsufficientCreditsError("Insufficient credits")
  }

  return succeed({
    userId: params.userId,
    amount: cost,
    type: 'usage' as const,
    operation: params.operation,
  })
}
