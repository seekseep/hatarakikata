import { z } from "zod"

import { createPagedItemsSchema } from "@/core/domain/schema"

export const CareerMapWithUserSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string().nullable(),
  startDate: z.string().nullable(),
})

export type CareerMapWithUser = z.infer<typeof CareerMapWithUserSchema>

export const PagedCareerMapsWithUserSchema = createPagedItemsSchema(CareerMapWithUserSchema)
export type PagedCareerMapsWithUser = z.infer<typeof PagedCareerMapsWithUserSchema>
