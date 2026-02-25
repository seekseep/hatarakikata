import { z } from "zod"

import { createPagedItemsSchema } from "@/core/domain/schema"

export const CarrerMapSummarySchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string().nullable(),
  startDate: z.string().nullable(),
})

export type CarrerMapSummary = z.infer<typeof CarrerMapSummarySchema>

export const PagedCarrerMapSummariesSchema = createPagedItemsSchema(CarrerMapSummarySchema)
export type PagedCarrerMapSummaries = z.infer<typeof PagedCarrerMapSummariesSchema>
