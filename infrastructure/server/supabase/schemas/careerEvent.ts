import { z } from "zod"

import { CareerMapEventTagRowSchema } from "./careerMapEventTag"

export const CareerEventRowSchema = z.object({
  id: z.string(),
  career_map_id: z.string(),
  name: z.string().nullable(),
  start_name: z.string().nullable(),
  end_name: z.string().nullable(),
  type: z.enum(["living", "working", "feeling"]),
  start_date: z.string(),
  end_date: z.string(),
  strength: z.number().int().min(1).max(5),
  row: z.number().int().min(0),
  description: z.string().nullable(),
})
export type CareerEventRow = z.infer<typeof CareerEventRowSchema>

export const CareerEventWithTagsRowSchema = CareerEventRowSchema.extend({
  career_map_event_tag_attachments: z.array(
    z.object({
      career_map_event_tags: CareerMapEventTagRowSchema,
    })
  ).default([]),
})
export type CareerEventWithTagsRow = z.infer<typeof CareerEventWithTagsRowSchema>
