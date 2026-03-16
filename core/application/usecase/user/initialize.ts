import { Executor } from "@/core/application/executor"
import { CreateCareerMapCommand, CreateCreditTransactionCommand, CreateMembershipCommand, CreateUserCommand } from "@/core/application/port"
import { FindUserQuery } from "@/core/application/port"
import { User } from "@/core/domain"
import { AppResult, failAsForbiddenError,failAsInvalidParametersError } from "@/core/util"

export type Initialize = (
  executor: Executor
) => Promise<AppResult<User>>

export type MakeInitializeDependencies = {
  createUserCommand: CreateUserCommand
  createCareerMapCommand: CreateCareerMapCommand
  findUserQuery: FindUserQuery
  createCreditTransactionCommand: CreateCreditTransactionCommand
  createMembershipCommand: CreateMembershipCommand
}

export function makeInitialize({
  createUserCommand,
  createCareerMapCommand,
  findUserQuery,
  createCreditTransactionCommand,
  createMembershipCommand,
}: MakeInitializeDependencies): Initialize {
  return async (executor) => {
    if (executor.type !== "user" || executor.userType !== "general") return failAsForbiddenError("Forbidden")

    const findUserResult = await findUserQuery({ id: executor.user.id })
    if (!findUserResult.success) return findUserResult

    if (findUserResult.data) return failAsInvalidParametersError("User already exists")

    const createUserResult = await createUserCommand({ id: executor.user.id, name: null })
    if (!createUserResult.success) return createUserResult

    const createCareerMapResult = await createCareerMapCommand({ userId: executor.user.id, startDate: null })
    if (!createCareerMapResult.success) return createCareerMapResult

    const membershipResult = await createMembershipCommand({ userId: executor.user.id, plan: 'free' })
    if (!membershipResult.success) return membershipResult

    const grantResult = await createCreditTransactionCommand({
      userId: executor.user.id,
      amount: 100,
      type: 'grant',
    })
    if (!grantResult.success) return grantResult

    return createUserResult
  }
}
