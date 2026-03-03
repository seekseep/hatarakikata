import z from "zod"

export const GuideNextActionTypeSchema = z.enum(["job-change", "learning"])
export type GuideNextActionType = z.infer<typeof GuideNextActionTypeSchema>

export const GuideNextActionSchema = z.object({
  type: GuideNextActionTypeSchema,
  title: z.string(),
  description: z.string(),
  url: z.string(),
})
export type GuideNextAction = z.infer<typeof GuideNextActionSchema>

export const GuideKeySchema = z.object({
  id: z.string(),
})

export const GuidePayloadSchema = z.object({
  userId: z.string(),
  careerMapId: z.string(),
  content: z.string(),
  nextActions: z.array(GuideNextActionSchema).min(1),
})

export const GuideSchema = GuideKeySchema.extend(GuidePayloadSchema.shape).extend({
  createdAt: z.string(),
})
export type Guide = z.infer<typeof GuideSchema>
export type GuidePayload = z.infer<typeof GuidePayloadSchema>
