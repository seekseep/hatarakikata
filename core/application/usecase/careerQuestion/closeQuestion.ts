import { z } from "zod"

import { Executor } from "@/core/application/executor"
import { UpdateCareerQuestionCommand } from "@/core/application/port"
import { FindCareerMapQuery, FindCareerQuestionQuery } from "@/core/application/port"
import { CareerQuestion, CareerQuestionKeySchema } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util"

const CloseQuestionParametersSchema = CareerQuestionKeySchema

export type CloseQuestionParametersInput = z.input<typeof CloseQuestionParametersSchema>

export type CloseQuestion = (
  input: CloseQuestionParametersInput,
  executor: Executor
) => Promise<AppResult<CareerQuestion>>

export type MakeCloseQuestionDependencies = {
  findCareerQuestionQuery: FindCareerQuestionQuery
  updateCareerQuestionCommand: UpdateCareerQuestionCommand
  findCareerMapQuery: FindCareerMapQuery
}

export function makeCloseQuestion({
  findCareerQuestionQuery,
  updateCareerQuestionCommand,
  findCareerMapQuery,
}: MakeCloseQuestionDependencies): CloseQuestion {
  return async (input, executor) => {
    const validation = CloseQuestionParametersSchema.safeParse(input)
    if (!validation.success)
      return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general")
      return failAsForbiddenError("Forbidden")

    const { id } = validation.data

    const findResult = await findCareerQuestionQuery({ id })
    if (!findResult.success) return findResult
    if (!findResult.data) return failAsNotFoundError("Question not found")

    const question = findResult.data

    // Authorization: verify the career map belongs to the user
    const careerMapResult = await findCareerMapQuery({ id: question.careerMapId })
    if (!careerMapResult.success) return careerMapResult
    if (!careerMapResult.data) return failAsNotFoundError("Career map not found")
    if (careerMapResult.data.userId !== executor.user.id)
      return failAsForbiddenError("Forbidden")

    if (question.status !== "open")
      return failAsInvalidParametersError("Question is already closed")

    const updateResult = await updateCareerQuestionCommand({ id, status: "closed" })
    if (!updateResult.success) return updateResult

    return succeed({ ...question, status: "closed" as const })
  }
}
