import { z } from "zod"

import { CareerQuestion, CareerQuestionKeySchema } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util/appResult"

import { Executor } from "../../executor"
import { UpdateCareerQuestionCommand } from "../../port/command"
import { FindCareerQuestionQuery } from "../../port/query"

const CloseQuestionParametersSchema = CareerQuestionKeySchema

export type CloseQuestionParametersInput = z.input<typeof CloseQuestionParametersSchema>

export type CloseQuestion = (
  input: CloseQuestionParametersInput,
  executor: Executor
) => Promise<AppResult<CareerQuestion>>

export type MakeCloseQuestionDependencies = {
  findCareerQuestionQuery: FindCareerQuestionQuery
  updateCareerQuestionCommand: UpdateCareerQuestionCommand
}

export function makeCloseQuestion({
  findCareerQuestionQuery,
  updateCareerQuestionCommand,
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

    if (question.userId !== executor.user.id)
      return failAsForbiddenError("Forbidden")

    if (question.status !== "open")
      return failAsInvalidParametersError("Question is already closed")

    const updateResult = await updateCareerQuestionCommand({ id, status: "closed" })
    if (!updateResult.success) return updateResult

    return succeed({ ...question, status: "closed" as const })
  }
}
