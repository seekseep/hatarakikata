import { z } from "zod"

import { PagedCarrerMapSummaries } from "@/core/domain/value/carrerMapSummary"
import { AppResult } from "@/core/util/appResult"

export const ListCareerMapsExcludingUserQueryParametersSchema = z.object({
  excludeUserId: z.string(),
  limit: z.number().int().min(1).max(50).default(10),
  offset: z.number().int().min(0).default(0),
})

export type ListCareerMapsExcludingUserQueryParametersInput = z.input<typeof ListCareerMapsExcludingUserQueryParametersSchema>

export type ListCareerMapsExcludingUserQueryParameters = z.infer<typeof ListCareerMapsExcludingUserQueryParametersSchema>

export type ListCareerMapsExcludingUserQuery = (parameters: ListCareerMapsExcludingUserQueryParametersInput) => Promise<AppResult<PagedCarrerMapSummaries>>
