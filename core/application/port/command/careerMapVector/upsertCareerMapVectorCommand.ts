import { z } from "zod"

import { AppResult } from "@/core/util/appResult"

export const UpsertCareerMapVectorCommandParametersSchema = z.object({
  careerMapId: z.string(),
  embedding: z.array(z.number()),
  tagWeights: z.record(z.string(), z.number()),
})

export type UpsertCareerMapVectorCommandParametersInput = z.input<typeof UpsertCareerMapVectorCommandParametersSchema>

export type UpsertCareerMapVectorCommandParameters = z.infer<typeof UpsertCareerMapVectorCommandParametersSchema>

export type UpsertCareerMapVectorCommand = (parameters: UpsertCareerMapVectorCommandParametersInput) => Promise<AppResult<void>>
