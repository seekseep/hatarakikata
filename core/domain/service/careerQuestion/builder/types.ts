import { z } from "zod"

import { CareerMapSchema, CareerQuestionFieldSchema, CareerQuestionSchema, UserSchema } from "@/core/domain"

export const QuestionBuilderParametersSchema = z.object({
  user: UserSchema,
  careerMap: CareerMapSchema,
})

export type QuestionBuilderParameters = z.infer<typeof QuestionBuilderParametersSchema>

export const QuestionBuilderResultSchema = z.object({
  name: z.string(),
  title: z.string(),
  fields: z.array(CareerQuestionFieldSchema),
  row: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type QuestionBuilderResult = z.infer<typeof QuestionBuilderResultSchema>

export type QuestionBuilder = (parameters: QuestionBuilderParameters) => QuestionBuilderResult

export const FollowUpQuestionBuilderParametersSchema = QuestionBuilderParametersSchema.extend({
  answeredQuestion: CareerQuestionSchema,
  answer: z.record(z.string(), z.unknown()),
})

export type FollowUpQuestionBuilderParameters = z.infer<typeof FollowUpQuestionBuilderParametersSchema>

export type FollowUpQuestionBuilder = (parameters: FollowUpQuestionBuilderParameters) => QuestionBuilderResult[]
