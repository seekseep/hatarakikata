import { z } from "zod"

import { Guide } from "@/core/domain"
import { AppResult } from "@/core/util/appResult"

export const ListGuidesByUserIdQueryParametersSchema = z.object({
  userId: z.string(),
})

export type ListGuidesByUserIdQueryParametersInput = z.input<typeof ListGuidesByUserIdQueryParametersSchema>

export type ListGuidesByUserIdQueryParameters = z.infer<typeof ListGuidesByUserIdQueryParametersSchema>

export type ListGuidesByUserIdQuery = (parameters: ListGuidesByUserIdQueryParametersInput) => Promise<AppResult<Guide[]>>
