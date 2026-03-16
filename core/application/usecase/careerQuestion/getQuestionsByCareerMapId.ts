import { z } from "zod"

import { Executor } from "@/core/application/executor"
import { FindCareerMapQuery, ListCareerQuestionsByCareerMapIdQuery } from "@/core/application/port"
import { CareerQuestion } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError } from "@/core/util"

const GetQuestionsByCareerMapIdParametersSchema = z.object({
  careerMapId: z.string(),
})

export type GetQuestionsByCareerMapIdParametersInput = z.input<typeof GetQuestionsByCareerMapIdParametersSchema>

export type GetQuestionsByCareerMapId = (
  input: GetQuestionsByCareerMapIdParametersInput,
  executor: Executor
) => Promise<AppResult<CareerQuestion[]>>

export type MakeGetQuestionsByCareerMapIdDependencies = {
  listCareerQuestionsByCareerMapIdQuery: ListCareerQuestionsByCareerMapIdQuery
  findCareerMapQuery: FindCareerMapQuery
}

export function makeGetQuestionsByCareerMapId({
  listCareerQuestionsByCareerMapIdQuery,
  findCareerMapQuery,
}: MakeGetQuestionsByCareerMapIdDependencies): GetQuestionsByCareerMapId {
  return async (input, executor) => {
    const validation = GetQuestionsByCareerMapIdParametersSchema.safeParse(input)
    if (!validation.success)
      return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general")
      return failAsForbiddenError("Forbidden")

    const { careerMapId } = validation.data

    const careerMapResult = await findCareerMapQuery({ id: careerMapId })
    if (!careerMapResult.success) return careerMapResult
    if (!careerMapResult.data) return failAsNotFoundError("Career map not found")
    if (careerMapResult.data.userId !== executor.user.id)
      return failAsForbiddenError("Forbidden")

    const result = await listCareerQuestionsByCareerMapIdQuery({ careerMapId })
    if (!result.success) return result

    if (result.data.length === 0)
      return failAsNotFoundError("No questions found")

    return result
  }
}
