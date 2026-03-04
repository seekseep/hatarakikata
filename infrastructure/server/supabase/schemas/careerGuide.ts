import { z } from "zod"

export const CareerGuideRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  base_career_map_id: z.string(),
  guide_career_map_id: z.string(),
  content: z.string(),
  next_actions: z.any(),
  created_at: z.string(),
})
export type CareerGuideRow = z.infer<typeof CareerGuideRowSchema>
