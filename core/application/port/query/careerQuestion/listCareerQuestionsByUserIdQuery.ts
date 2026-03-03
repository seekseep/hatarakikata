import { z } from "zod"

import { CareerQuestion } from "@/core/domain"
import { AppResult } from "@/core/util/appResult"

export const ListCareerQuestionsByUserIdQueryParametersSchema = z.object({
  userId: z.string(),
})

export type ListCareerQuestionsByUserIdQueryParametersInput = z.input<typeof ListCareerQuestionsByUserIdQueryParametersSchema>

export type ListCareerQuestionsByUserIdQueryParameters = z.infer<typeof ListCareerQuestionsByUserIdQueryParametersSchema>

export type ListCareerQuestionsByUserIdQuery = (parameters: ListCareerQuestionsByUserIdQueryParametersInput) => Promise<AppResult<CareerQuestion[]>>
