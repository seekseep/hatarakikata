import { z } from "zod"

import { CareerGuideWithSource } from "@/core/domain"
import { AppResult } from "@/core/util/appResult"

export const ListCareerGuidesByUserIdQueryParametersSchema = z.object({
  userId: z.string(),
})

export type ListCareerGuidesByUserIdQueryParametersInput = z.input<typeof ListCareerGuidesByUserIdQueryParametersSchema>

export type ListCareerGuidesByUserIdQueryParameters = z.infer<typeof ListCareerGuidesByUserIdQueryParametersSchema>

export type ListCareerGuidesByUserIdQuery = (parameters: ListCareerGuidesByUserIdQueryParametersInput) => Promise<AppResult<CareerGuideWithSource[]>>
