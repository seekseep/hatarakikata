import { z } from "zod"

import { CareerEvent, CareerQuestion, CareerQuestionKeySchema } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError } from "@/core/util/appResult"

import { Executor } from "../../executor"
import { CreateCareerEventCommand } from "../../port/command"
import { UpdateCareerQuestionCommand } from "../../port/command"
import { FindCareerMapQuery, FindCareerQuestionQuery } from "../../port/query"

const AnswerQuestionParametersSchema = CareerQuestionKeySchema.extend({
  answer: z.record(z.string(), z.unknown()),
})

export type AnswerQuestionParametersInput = z.input<typeof AnswerQuestionParametersSchema>

export type AnswerQuestion = (
  input: AnswerQuestionParametersInput,
  executor: Executor
) => Promise<AppResult<CareerEvent>>

export type MakeAnswerQuestionDependencies = {
  findCareerQuestionQuery: FindCareerQuestionQuery
  updateCareerQuestionCommand: UpdateCareerQuestionCommand
  createCareerEventCommand: CreateCareerEventCommand
  findCareerMapQuery: FindCareerMapQuery
}

// CareerEvent 作成パラメータを生成する関数型
type CareerEventCreator = (
  question: CareerQuestion,
  answer: Record<string, unknown>,
  careerMapId: string,
) => Parameters<CreateCareerEventCommand>[0]

// デフォルト: binding でマッピング
function defaultCareerEventCreator(
  question: CareerQuestion,
  answer: Record<string, unknown>,
  careerMapId: string,
): Parameters<CreateCareerEventCommand>[0] {
  const params: Record<string, unknown> = { careerMapId }

  for (const field of question.fields) {
    if (field.binding && answer[field.name] !== undefined) {
      params[field.binding] = answer[field.name]
    }
  }

  params.type = params.type ?? "living"
  params.strength = params.strength ?? 3
  params.row = params.row ?? 0
  params.tags = params.tags ?? []
  params.startDate = params.startDate ?? ""
  params.endDate = params.endDate ?? ""

  return params as Parameters<CreateCareerEventCommand>[0]
}

// name ごとの特殊ハンドラーマップ（将来の拡張用）
const CAREER_EVENT_CREATORS: Record<string, CareerEventCreator> = {}

export function makeAnswerQuestion({
  findCareerQuestionQuery,
  updateCareerQuestionCommand,
  createCareerEventCommand,
  findCareerMapQuery,
}: MakeAnswerQuestionDependencies): AnswerQuestion {
  return async (input, executor) => {
    const validation = AnswerQuestionParametersSchema.safeParse(input)
    if (!validation.success)
      return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general")
      return failAsForbiddenError("Forbidden")

    const { id, answer } = validation.data

    // Find the question
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

    // Question must be open
    if (question.status !== "open")
      return failAsInvalidParametersError("Question is already closed")

    const careerMapId = question.careerMapId

    // name に基づいてハンドラーを選択
    const creator = CAREER_EVENT_CREATORS[question.name] ?? defaultCareerEventCreator
    const careerEventParams = creator(question, answer, careerMapId)

    // Create the CareerEvent
    const createResult = await createCareerEventCommand(careerEventParams)
    if (!createResult.success) return createResult

    // Close the question
    const updateResult = await updateCareerQuestionCommand({ id, status: "closed" })
    if (!updateResult.success) return updateResult

    return createResult
  }
}
