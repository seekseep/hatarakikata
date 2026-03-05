import { z } from "zod"

import { CareerQuestion } from "@/core/domain"
import { AppResult } from "@/core/util/appResult"

export const ListCareerQuestionsByCareerMapIdQueryParametersSchema = z.object({
  careerMapId: z.string(),
})

export type ListCareerQuestionsByCareerMapIdQueryParametersInput = z.input<typeof ListCareerQuestionsByCareerMapIdQueryParametersSchema>

export type ListCareerQuestionsByCareerMapIdQueryParameters = z.infer<typeof ListCareerQuestionsByCareerMapIdQueryParametersSchema>

export type ListCareerQuestionsByCareerMapIdQuery = (parameters: ListCareerQuestionsByCareerMapIdQueryParametersInput) => Promise<AppResult<CareerQuestion[]>>
