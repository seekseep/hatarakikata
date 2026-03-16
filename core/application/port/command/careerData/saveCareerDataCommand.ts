import { z } from "zod"

import { GeneratedCareerEventParameterSchema } from "@/core/domain"
import type { AppResult } from "@/core/util/appResult"

export const SaveCareerDataCommandParametersSchema = z.object({
  personName: z.string(),
  language: z.string(),
  birthDate: z.string().nullable(),
  events: z.array(GeneratedCareerEventParameterSchema),
})

export type SaveCareerDataCommandParametersInput = z.input<typeof SaveCareerDataCommandParametersSchema>

export type SaveCareerDataCommandParameters = z.infer<typeof SaveCareerDataCommandParametersSchema>

export type SaveCareerDataCommand = (
  parameters: SaveCareerDataCommandParametersInput
) => Promise<AppResult<{ filePath: string }>>
