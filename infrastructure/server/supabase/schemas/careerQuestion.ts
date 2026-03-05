import { z } from "zod"

export const CareerQuestionRowSchema = z.object({
  id: z.string(),
  career_map_id: z.string(),
  name: z.string(),
  title: z.string(),
  status: z.enum(["open", "closed"]),
  fields: z.any(),
  row: z.number().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
})
export type CareerQuestionRow = z.infer<typeof CareerQuestionRowSchema>
