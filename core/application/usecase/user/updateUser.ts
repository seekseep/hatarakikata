import { z } from "zod"

import { Executor } from "@/core/application/executor"
import { UpdateUserCommand, UpdateUserCommandParametersSchema } from "@/core/application/port"
import { FindUserQuery } from "@/core/application/port"
import { User } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError } from "@/core/util"

const UpdateUserParametersSchema = UpdateUserCommandParametersSchema

export type UpdateUserParametersInput = z.input<typeof UpdateUserParametersSchema>

export type UpdateUserParameters = z.infer<typeof UpdateUserParametersSchema>

export type UpdateUser = (
  input: UpdateUserParametersInput,
  executor: Executor
) => Promise<AppResult<User>>

export type MakeUpdateUserDependencies = {
  updateUserCommand: UpdateUserCommand
  findUserQuery: FindUserQuery
}

export function makeUpdateUser({
  updateUserCommand,
  findUserQuery,
}: MakeUpdateUserDependencies): UpdateUser {
  return async (input, executor) => {
    const validation = UpdateUserParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general") return failAsForbiddenError("Forbidden")

    const parameters = validation.data

    const findUserResult = await findUserQuery({ id: parameters.id })
    if (!findUserResult.success) return findUserResult

    if (!findUserResult.data) return failAsNotFoundError("User is not found")

    if (parameters.id !== executor.user.id) {
      return failAsForbiddenError("Forbidden")
    }

    return await updateUserCommand(parameters)
  }
}
