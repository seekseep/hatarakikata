import { z } from "zod"

import { GeneratedCareerEventParameterSchema } from "@/core/domain"
import type { AppResult } from "@/core/util/appResult"

export const CareerDataSchema = z.object({
  personName: z.string(),
  language: z.string(),
  birthDate: z.string().nullable(),
  events: z.array(GeneratedCareerEventParameterSchema),
})

export type CareerData = z.infer<typeof CareerDataSchema>

export type SaveCareerDataCommand = (
  data: CareerData
) => Promise<AppResult<{ filePath: string }>>
