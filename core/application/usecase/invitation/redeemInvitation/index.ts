import { z } from "zod"

import type { Executor } from "@/core/application/executor"
import type { UpdateInvitationCommand, UpdateMembershipCommand } from "@/core/application/port/command"
import type { FindInvitationByCodeQuery } from "@/core/application/port/query"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util/appResult"

const RedeemInvitationParametersSchema = z.object({
  code: z.string().min(1),
})

export type RedeemInvitationParametersInput = z.input<typeof RedeemInvitationParametersSchema>

export type RedeemInvitation = (
  input: RedeemInvitationParametersInput,
  executor: Executor
) => Promise<AppResult<void>>

export type MakeRedeemInvitationDependencies = {
  findInvitationByCodeQuery: FindInvitationByCodeQuery
  updateInvitationCommand: UpdateInvitationCommand
  updateMembershipCommand: UpdateMembershipCommand
}

export function makeRedeemInvitation({
  findInvitationByCodeQuery,
  updateInvitationCommand,
  updateMembershipCommand,
}: MakeRedeemInvitationDependencies): RedeemInvitation {
  return async (input, executor) => {
    const validation = RedeemInvitationParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general") {
      return failAsForbiddenError("Forbidden")
    }

    const { code } = validation.data

    // コード検索
    const findResult = await findInvitationByCodeQuery({ code })
    if (!findResult.success) return findResult
    if (!findResult.data) return failAsNotFoundError("招待コードが見つかりません")

    const invitation = findResult.data

    // 使用済みチェック
    if (invitation.usedAt) return failAsInvalidParametersError("この招待コードは使用済みです")

    // メンバーシップをpremiumに更新
    const membershipResult = await updateMembershipCommand({ userId: executor.user.id, plan: 'premium' })
    if (!membershipResult.success) return membershipResult

    // used_count更新
    const updateResult = await updateInvitationCommand({ invitationId: invitation.id })
    if (!updateResult.success) return updateResult

    return succeed(undefined)
  }
}
