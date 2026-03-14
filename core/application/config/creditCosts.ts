export const CREDIT_COSTS = {
  generateCareerGuide: 10,
  generateCareerEvents: 10,
  generateCareerEventsFromBiography: 30,
  createEmbedding: 1,
} as const

export type AiOperationName = keyof typeof CREDIT_COSTS
