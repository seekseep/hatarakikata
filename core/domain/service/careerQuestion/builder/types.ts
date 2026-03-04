import type { CareerMap, CareerQuestionField, User } from "@/core/domain"

export type QuestionBuilderParams = {
  user: User
  careerMap: CareerMap
}

export type QuestionBuilderResult = {
  name: string
  title: string
  fields: CareerQuestionField[]
  row?: number
  startDate?: string
  endDate?: string
}

export type QuestionBuilder = (params: QuestionBuilderParams) => QuestionBuilderResult
