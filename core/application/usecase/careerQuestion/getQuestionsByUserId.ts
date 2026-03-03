import { CareerQuestion } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsNotFoundError } from "@/core/util/appResult"

import { Executor } from "../../executor"
import { ListCareerQuestionsByUserIdQuery } from "../../port/query"

export type GetQuestionsByUserId = (
  executor: Executor
) => Promise<AppResult<CareerQuestion[]>>

export type MakeGetQuestionsByUserIdDependencies = {
  listCareerQuestionsByUserIdQuery: ListCareerQuestionsByUserIdQuery
}

export function makeGetQuestionsByUserId({
  listCareerQuestionsByUserIdQuery,
}: MakeGetQuestionsByUserIdDependencies): GetQuestionsByUserId {
  return async (executor) => {
    if (executor.type !== "user" || executor.userType !== "general")
      return failAsForbiddenError("Forbidden")

    const result = await listCareerQuestionsByUserIdQuery({ userId: executor.user.id })
    if (!result.success) return result

    if (result.data.length === 0)
      return failAsNotFoundError("No questions found")

    return result
  }
}
