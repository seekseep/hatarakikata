import type { CareerMap, CareerQuestion, CareerQuestionField, User } from "@/core/domain"

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

export type FollowUpQuestionBuilderParams = QuestionBuilderParams & {
  answeredQuestion: CareerQuestion
  answer: Record<string, unknown>
}

export type FollowUpQuestionBuilder = (params: FollowUpQuestionBuilderParams) => QuestionBuilderResult[]
