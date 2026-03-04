import { z } from "zod"

export const CareerQuestionRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  title: z.string(),
  status: z.enum(["open", "closed"]),
  fields: z.any(),
})
export type CareerQuestionRow = z.infer<typeof CareerQuestionRowSchema>
