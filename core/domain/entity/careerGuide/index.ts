import z from "zod"

export const CareerGuideNextActionTypeSchema = z.enum(["job-change", "learning"])
export type CareerGuideNextActionType = z.infer<typeof CareerGuideNextActionTypeSchema>

export const CareerGuideNextActionSchema = z.object({
  type: CareerGuideNextActionTypeSchema,
  title: z.string(),
  description: z.string(),
  url: z.string(),
})
export type CareerGuideNextAction = z.infer<typeof CareerGuideNextActionSchema>

export const CareerGuideKeySchema = z.object({
  id: z.string(),
})

export const CareerGuidePayloadSchema = z.object({
  userId: z.string(),
  baseCareerMapId: z.string(),
  guideCareerMapId: z.string(),
  content: z.string(),
  nextActions: z.array(CareerGuideNextActionSchema).min(1),
})

export const CareerGuideSchema = CareerGuideKeySchema.extend(CareerGuidePayloadSchema.shape).extend({
  createdAt: z.string(),
})
export type CareerGuide = z.infer<typeof CareerGuideSchema>
export type CareerGuidePayload = z.infer<typeof CareerGuidePayloadSchema>

export const CareerGuideWithSourceSchema = CareerGuideSchema.extend({
  sourceUserName: z.string().nullable(),
})
export type CareerGuideWithSource = z.infer<typeof CareerGuideWithSourceSchema>
