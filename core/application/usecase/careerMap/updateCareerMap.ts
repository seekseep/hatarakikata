import { z } from "zod"

import { Executor } from "@/core/application/executor"
import { UpdateCareerMapCommand, UpdateCareerMapCommandParametersSchema } from "@/core/application/port"
import { FindCareerMapQuery } from "@/core/application/port"
import { CareerMap } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError } from "@/core/util"

const UpdateCareerMapParametersSchema = UpdateCareerMapCommandParametersSchema

export type UpdateCareerMapParametersInput = z.input<typeof UpdateCareerMapParametersSchema>

export type UpdateCareerMapParameters = z.infer<typeof UpdateCareerMapParametersSchema>

export type UpdateCareerMap = (
  input: UpdateCareerMapParametersInput,
  executor: Executor
) => Promise<AppResult<CareerMap>>

export type MakeUpdateCareerMapDependencies = {
  updateCareerMapCommand: UpdateCareerMapCommand
  findCareerMapQuery: FindCareerMapQuery
}

export function makeUpdateCareerMap({
  updateCareerMapCommand,
  findCareerMapQuery,
}: MakeUpdateCareerMapDependencies): UpdateCareerMap {
  return async (input, executor) => {
    const validation = UpdateCareerMapParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general") return failAsForbiddenError("Forbidden")

    const parameters = validation.data

    const findCareerMapResult = await findCareerMapQuery({ id: parameters.id })
    if (!findCareerMapResult.success) return findCareerMapResult

    const careerMap = findCareerMapResult.data
    if (!careerMap) return failAsNotFoundError("Career map is not found")

    if (careerMap.userId !== executor.user.id) {
      return failAsForbiddenError("Forbidden")
    }

    return await updateCareerMapCommand(parameters)
  }
}
