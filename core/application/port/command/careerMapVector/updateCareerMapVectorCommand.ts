import { z } from "zod"

import { AppResult } from "@/core/util/appResult"

export const UpdateCareerMapVectorCommandParametersSchema = z.object({
  careerMapId: z.string(),
  embedding: z.array(z.number()),
  tagWeights: z.record(z.string(), z.number()),
})

export type UpdateCareerMapVectorCommandParametersInput = z.input<typeof UpdateCareerMapVectorCommandParametersSchema>

export type UpdateCareerMapVectorCommandParameters = z.infer<typeof UpdateCareerMapVectorCommandParametersSchema>

export type UpdateCareerMapVectorCommand = (parameters: UpdateCareerMapVectorCommandParametersInput) => Promise<AppResult<void>>
