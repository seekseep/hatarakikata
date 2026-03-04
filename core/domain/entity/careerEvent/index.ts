import z from "zod"

import { createPagedItemsSchema } from "@/core/domain/schema"

export const CareerEventTypeSchema = z.enum(["living", "working", "feeling"])
export type CareerEventType = z.infer<typeof CareerEventTypeSchema>

export const CareerEventKeySchema = z.object({
  id: z.string(),
})

export const careerEventPayloadBaseObject = z.object({
  careerMapId: z.string(),
  name: z.string(),
  type: CareerEventTypeSchema.default("working"),
  startDate: z.string(),
  endDate: z.string(),
  tags: z.array(z.string()),
  strength: z.number().int().min(1).max(5).default(3),
  row: z.number().int().min(0).default(0),
  description: z.string().nullable().default(null),
})

export const CareerEventPayloadBaseSchema = careerEventPayloadBaseObject

export const CareerEventPayloadSchema = CareerEventPayloadBaseSchema

export const CareerEventTagSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const CareerEventSchema = CareerEventKeySchema.extend(careerEventPayloadBaseObject.shape).extend({
  tags: z.array(CareerEventTagSchema),
})
export type CareerEvent = z.infer<typeof CareerEventSchema>
export type CareerEventPayload = z.infer<typeof CareerEventPayloadSchema>


export const PagedCareerEventsSchema = createPagedItemsSchema(CareerEventSchema)
export type PagedCareerEvents = z.infer<typeof PagedCareerEventsSchema>
