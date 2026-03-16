import { z } from "zod"

import { Executor } from "@/core/application/executor"
import { UpdateCareerQuestionCommand, UpdateCareerQuestionCommandParametersSchema } from "@/core/application/port"
import { FindCareerMapQuery, FindCareerQuestionQuery } from "@/core/application/port"
import { CareerQuestion } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util"

const UpdateCareerQuestionParametersSchema = UpdateCareerQuestionCommandParametersSchema

export type UpdateCareerQuestionParametersInput = z.input<typeof UpdateCareerQuestionParametersSchema>

export type UpdateCareerQuestionParameters = z.infer<typeof UpdateCareerQuestionParametersSchema>

export type UpdateCareerQuestion = (
  input: UpdateCareerQuestionParametersInput,
  executor: Executor
) => Promise<AppResult<CareerQuestion>>

export type MakeUpdateCareerQuestionDependencies = {
  updateCareerQuestionCommand: UpdateCareerQuestionCommand
  findCareerQuestionQuery: FindCareerQuestionQuery
  findCareerMapQuery: FindCareerMapQuery
}

export function makeUpdateCareerQuestion({
  updateCareerQuestionCommand,
  findCareerQuestionQuery,
  findCareerMapQuery,
}: MakeUpdateCareerQuestionDependencies): UpdateCareerQuestion {
  return async (input, executor) => {
    const validation = UpdateCareerQuestionParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general") return failAsForbiddenError("Forbidden")

    const parameters = validation.data

    const findResult = await findCareerQuestionQuery({ id: parameters.id })
    if (!findResult.success) return findResult
    if (!findResult.data) return failAsNotFoundError("Career question is not found")

    const question = findResult.data

    const findCareerMapResult = await findCareerMapQuery({ id: question.careerMapId })
    if (!findCareerMapResult.success) return findCareerMapResult
    if (!findCareerMapResult.data) return failAsNotFoundError("Career map is not found")

    if (findCareerMapResult.data.userId !== executor.user.id) {
      return failAsForbiddenError("Forbidden")
    }

    const updateResult = await updateCareerQuestionCommand(parameters)
    if (!updateResult.success) return updateResult

    const updatedResult = await findCareerQuestionQuery({ id: parameters.id })
    if (!updatedResult.success) return updatedResult
    if (!updatedResult.data) return failAsNotFoundError("Career question is not found")

    return succeed(updatedResult.data)
  }
}
