import { z } from "zod"

import { AppResult } from "@/core/util/appResult"

export const CareerMapVectorMatchSchema = z.object({
  careerMapId: z.string(),
  similarity: z.number(),
  tagWeights: z.record(z.string(), z.number()),
  userName: z.string().nullable(),
})

export type CareerMapVectorMatch = z.infer<typeof CareerMapVectorMatchSchema>

export const MatchCareerMapVectorsQueryParametersSchema = z.object({
  embedding: z.array(z.number()),
  matchCount: z.number(),
  excludeCareerMapId: z.string(),
})

export type MatchCareerMapVectorsQueryParametersInput = z.input<typeof MatchCareerMapVectorsQueryParametersSchema>

export type MatchCareerMapVectorsQueryParameters = z.infer<typeof MatchCareerMapVectorsQueryParametersSchema>

export type MatchCareerMapVectorsQuery = (parameters: MatchCareerMapVectorsQueryParametersInput) => Promise<AppResult<CareerMapVectorMatch[]>>
