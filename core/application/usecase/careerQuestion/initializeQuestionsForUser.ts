import { z } from "zod"

import { Executor } from "@/core/application/executor"
import { CreateCareerQuestionCommand } from "@/core/application/port"
import { FindCareerMapQuery, ListCareerQuestionsByCareerMapIdQuery } from "@/core/application/port"
import { CareerQuestion } from "@/core/domain"
import { QUESTION_BUILDERS } from "@/core/domain/service/careerQuestion/builder"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util"

const InitializeQuestionsParametersSchema = z.object({
  careerMapId: z.string(),
})

export type InitializeQuestionsParametersInput = z.input<typeof InitializeQuestionsParametersSchema>

export type InitializeQuestionsForUser = (
  input: InitializeQuestionsParametersInput,
  executor: Executor
) => Promise<AppResult<CareerQuestion[]>>

export type MakeInitializeQuestionsForUserDependencies = {
  createCareerQuestionCommand: CreateCareerQuestionCommand
  listCareerQuestionsByCareerMapIdQuery: ListCareerQuestionsByCareerMapIdQuery
  findCareerMapQuery: FindCareerMapQuery
}

export function makeInitializeQuestionsForUser({
  createCareerQuestionCommand,
  listCareerQuestionsByCareerMapIdQuery,
  findCareerMapQuery,
}: MakeInitializeQuestionsForUserDependencies): InitializeQuestionsForUser {
  return async (input, executor) => {
    const validation = InitializeQuestionsParametersSchema.safeParse(input)
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

    const careerMap = careerMapResult.data

    const existingResult = await listCareerQuestionsByCareerMapIdQuery({ careerMapId })
    if (!existingResult.success) return existingResult
    if (existingResult.data.length > 0)
      return failAsInvalidParametersError("Questions already initialized for this career map")

    const createdQuestions: CareerQuestion[] = []
    for (const builder of QUESTION_BUILDERS) {
      const questionData = builder({ user: executor.user, careerMap })

      const result = await createCareerQuestionCommand({
        careerMapId,
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
