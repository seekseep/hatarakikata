import { z } from "zod"

export const CREDIT_COSTS = {
  generateCareerGuide: 10,
  generateCareerEvents: 10,
  generateCareerEventsFromBiography: 30,
  createEmbedding: 1,
} as const

export const AiOperationNameSchema = z.enum([
  'generateCareerGuide',
  'generateCareerEvents',
  'generateCareerEventsFromBiography',
  'createEmbedding',
])

export type AiOperationName = z.infer<typeof AiOperationNameSchema>
