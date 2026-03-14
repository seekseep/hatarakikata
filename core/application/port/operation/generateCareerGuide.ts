import { z } from "zod"

import type { GenerateCareerGuideResult } from "@/core/domain"
import { CareerEventSchema, GenerateCareerGuideResultSchema } from "@/core/domain"
import type { AppResult } from "@/core/util/appResult"

export const GenerateCareerGuideOperationParametersSchema = z.object({
  userName: z.string().min(1),
  baseCareerEvents: z.array(CareerEventSchema),
  guideCareerMapName: z.string().min(1),
  guideCareerEvents: z.array(CareerEventSchema),
})

export type GenerateCareerGuideOperationParametersInput = z.input<
  typeof GenerateCareerGuideOperationParametersSchema
>

export type GenerateCareerGuideOperationParameters = z.infer<
  typeof GenerateCareerGuideOperationParametersSchema
>

export { GenerateCareerGuideResultSchema }

export type GenerateCareerGuideOperationResult = GenerateCareerGuideResult

export type GenerateCareerGuideOperation = (
  parameters: GenerateCareerGuideOperationParameters
) => Promise<AppResult<GenerateCareerGuideOperationResult>>
