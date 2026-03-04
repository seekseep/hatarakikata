import { CareerQuestion } from "@/core/domain"
import { QUESTION_BUILDERS } from "@/core/domain/service/careerQuestion/builder"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, succeed } from "@/core/util/appResult"

import { Executor } from "../../executor"
import { CreateCareerQuestionCommand } from "../../port/command"
import { ListCareerMapByUserIdQuery, ListCareerQuestionsByUserIdQuery } from "../../port/query"

export type InitializeQuestionsForUser = (
  executor: Executor
) => Promise<AppResult<CareerQuestion[]>>

export type MakeInitializeQuestionsForUserDependencies = {
  createCareerQuestionCommand: CreateCareerQuestionCommand
  listCareerQuestionsByUserIdQuery: ListCareerQuestionsByUserIdQuery
  listCareerMapByUserIdQuery: ListCareerMapByUserIdQuery
}

export function makeInitializeQuestionsForUser({
  createCareerQuestionCommand,
  listCareerQuestionsByUserIdQuery,
  listCareerMapByUserIdQuery,
}: MakeInitializeQuestionsForUserDependencies): InitializeQuestionsForUser {
  return async (executor) => {
    if (executor.type !== "user" || executor.userType !== "general")
      return failAsForbiddenError("Forbidden")

    const existingResult = await listCareerQuestionsByUserIdQuery({ userId: executor.user.id })
    if (!existingResult.success) return existingResult
    if (existingResult.data.length > 0)
      return failAsInvalidParametersError("Questions already initialized for this user")

    const careerMapsResult = await listCareerMapByUserIdQuery({ userId: executor.user.id })
    if (!careerMapsResult.success) return careerMapsResult
    const careerMap = careerMapsResult.data.items[0]

    const createdQuestions: CareerQuestion[] = []
    for (const builder of QUESTION_BUILDERS) {
      const questionData = builder({ user: executor.user, careerMap })

      const result = await createCareerQuestionCommand({
        userId: executor.user.id,
        name: questionData.name,
        title: questionData.title,
        status: "open",
        fields: questionData.fields,
        row: questionData.row,
        startDate: questionData.startDate,
        endDate: questionData.endDate,
      })
      if (!result.success) return result
      createdQuestions.push(result.data)
    }

    return succeed(createdQuestions)
  }
}
