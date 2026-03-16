import { z } from "zod"

import { AppResult } from "@/core/util/appResult"

export const CreateCareerMapVectorCommandParametersSchema = z.object({
  careerMapId: z.string(),
  embedding: z.array(z.number()),
  tagWeights: z.record(z.string(), z.number()),
})

export type CreateCareerMapVectorCommandParametersInput = z.input<typeof CreateCareerMapVectorCommandParametersSchema>

export type CreateCareerMapVectorCommandParameters = z.infer<typeof CreateCareerMapVectorCommandParametersSchema>

export type CreateCareerMapVectorCommand = (parameters: CreateCareerMapVectorCommandParametersInput) => Promise<AppResult<void>>
