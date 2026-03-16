import { z } from "zod"

import { Executor } from "@/core/application/executor"
import { DeleteCareerEventCommand,DeleteCareerMapCommand, DeleteUserCommand, DeleteUserCommandParametersSchema } from "@/core/application/port"
import { FindUserQuery, ListCareerEventsByCareerMapIdQuery,ListCareerMapByUserIdQuery } from "@/core/application/port"
import { User } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError } from "@/core/util"

const WithdrawParametersSchema = DeleteUserCommandParametersSchema

export type WithdrawParametersInput = z.input<typeof WithdrawParametersSchema>

export type WithdrawParameters = z.infer<typeof WithdrawParametersSchema>

export type Withdraw = (
  input: WithdrawParametersInput,
  executor: Executor
) => Promise<AppResult<User>>

export type MakeWithdrawDependencies = {
  deleteUserCommand: DeleteUserCommand
  deleteCareerMapCommand: DeleteCareerMapCommand
  deleteCareerEventCommand: DeleteCareerEventCommand
  findUserQuery: FindUserQuery
  listCareerMapByUserIdQuery: ListCareerMapByUserIdQuery
  listCareerEventsByCareerMapIdQuery: ListCareerEventsByCareerMapIdQuery
}

export function makeWithdraw({
  deleteUserCommand,
  deleteCareerMapCommand,
  deleteCareerEventCommand,
  findUserQuery,
  listCareerMapByUserIdQuery,
  listCareerEventsByCareerMapIdQuery,
}: MakeWithdrawDependencies): Withdraw {
  return async (input, executor) => {
    const validation = WithdrawParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general") return failAsForbiddenError("Forbidden")

    const parameters = validation.data

    const findUserResult = await findUserQuery({ id: parameters.id })
    if (!findUserResult.success) return findUserResult

    if (!findUserResult.data) return failAsNotFoundError("User is not found")

    if (parameters.id !== executor.user.id) {
      return failAsForbiddenError("Forbidden")
    }

    // Delete related career events and career maps
    const listCareerMapsResult = await listCareerMapByUserIdQuery({ userId: parameters.id })
    if (!listCareerMapsResult.success) return listCareerMapsResult

    for (const careerMap of listCareerMapsResult.data.items) {
      const listEventsResult = await listCareerEventsByCareerMapIdQuery({ careerMapId: careerMap.id })
      if (!listEventsResult.success) return listEventsResult

      for (const event of listEventsResult.data.items) {
        const deleteEventResult = await deleteCareerEventCommand({ id: event.id })
        if (!deleteEventResult.success) return deleteEventResult
      }

      const deleteMapResult = await deleteCareerMapCommand({ id: careerMap.id })
      if (!deleteMapResult.success) return deleteMapResult
    }

    return await deleteUserCommand(parameters)
  }
}
