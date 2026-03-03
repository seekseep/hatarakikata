import { z } from "zod"

export const GuideRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  career_map_id: z.string(),
  content: z.string(),
  next_actions: z.any(),
  created_at: z.string(),
})
export type GuideRow = z.infer<typeof GuideRowSchema>
