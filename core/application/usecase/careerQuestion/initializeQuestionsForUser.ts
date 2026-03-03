import { CareerQuestion, CareerQuestionField } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, succeed } from "@/core/util/appResult"

import { Executor } from "../../executor"
import { CreateCareerQuestionCommand } from "../../port/command"
import { ListCareerQuestionsByUserIdQuery } from "../../port/query"

const INITIAL_QUESTIONS: { name: string; fields: CareerQuestionField[] }[] = [
  {
    name: "elementary_school",
    fields: [
      { name: "school_name", binding: "name", label: "小学校の名前", type: "text" },
      { name: "start_date", binding: "startDate", label: "入学年月", type: "date" },
      { name: "end_date", binding: "endDate", label: "卒業年月", type: "date" },
      { name: "description", binding: "description", label: "小学校での思い出", type: "text" },
    ],
  },
  {
    name: "middle_school",
    fields: [
      { name: "school_name", binding: "name", label: "中学校の名前", type: "text" },
      { name: "start_date", binding: "startDate", label: "入学年月", type: "date" },
      { name: "end_date", binding: "endDate", label: "卒業年月", type: "date" },
      { name: "description", binding: "description", label: "中学校での思い出", type: "text" },
    ],
  },
  {
    name: "high_school",
    fields: [
      { name: "enrolled", binding: null, label: "高校に進学しましたか？", type: "radio", options: ["はい", "いいえ"] },
      { name: "category", binding: null, label: "種別", type: "select", options: ["普通科高校", "工業高校", "商業高校", "高等専門学校"], condition: { and: [{ name: "enrolled", value: "はい" }] } },
      { name: "school_name", binding: "name", label: "学校名", type: "text", condition: { and: [{ name: "enrolled", value: "はい" }] } },
      { name: "start_date", binding: "startDate", label: "入学年月", type: "date", condition: { and: [{ name: "enrolled", value: "はい" }] } },
      { name: "end_date", binding: "endDate", label: "卒業年月", type: "date", condition: { and: [{ name: "enrolled", value: "はい" }] } },
      { name: "description", binding: "description", label: "高校での思い出", type: "text", condition: { and: [{ name: "enrolled", value: "はい" }] } },
    ],
  },
  {
    name: "university",
    fields: [
      { name: "enrolled", binding: null, label: "大学・専門学校等に進学しましたか？", type: "radio", options: ["はい", "いいえ"] },
      { name: "category", binding: null, label: "種別", type: "select", options: ["大学", "短期大学", "専門学校"], condition: { and: [{ name: "enrolled", value: "はい" }] } },
      { name: "school_name", binding: "name", label: "学校名", type: "text", condition: { and: [{ name: "enrolled", value: "はい" }] } },
      { name: "start_date", binding: "startDate", label: "入学年月", type: "date", condition: { and: [{ name: "enrolled", value: "はい" }] } },
      { name: "end_date", binding: "endDate", label: "卒業年月", type: "date", condition: { and: [{ name: "enrolled", value: "はい" }] } },
      { name: "description", binding: "description", label: "学校での思い出", type: "text", condition: { and: [{ name: "enrolled", value: "はい" }] } },
    ],
  },
]

export type InitializeQuestionsForUser = (
  executor: Executor
) => Promise<AppResult<CareerQuestion[]>>

export type MakeInitializeQuestionsForUserDependencies = {
  createCareerQuestionCommand: CreateCareerQuestionCommand
  listCareerQuestionsByUserIdQuery: ListCareerQuestionsByUserIdQuery
}

export function makeInitializeQuestionsForUser({
  createCareerQuestionCommand,
  listCareerQuestionsByUserIdQuery,
}: MakeInitializeQuestionsForUserDependencies): InitializeQuestionsForUser {
  return async (executor) => {
    if (executor.type !== "user" || executor.userType !== "general")
      return failAsForbiddenError("Forbidden")

    const existingResult = await listCareerQuestionsByUserIdQuery({ userId: executor.user.id })
    if (!existingResult.success) return existingResult
    if (existingResult.data.length > 0)
      return failAsInvalidParametersError("Questions already initialized for this user")

    const createdQuestions: CareerQuestion[] = []
    for (const q of INITIAL_QUESTIONS) {
      const result = await createCareerQuestionCommand({
        userId: executor.user.id,
        name: q.name,
        status: "open",
        fields: q.fields,
      })
      if (!result.success) return result
      createdQuestions.push(result.data)
    }

    return succeed(createdQuestions)
  }
}
