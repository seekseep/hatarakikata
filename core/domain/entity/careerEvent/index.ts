import z from "zod"

import { createPagedItemsSchema } from "@/core/domain/schema"

export const CareerEventTypeSchema = z.enum(["living", "working", "feeling"])
export type CareerEventType = z.infer<typeof CareerEventTypeSchema>

export const CareerEventKeySchema = z.object({
  id: z.string(),
})

export const careerEventPayloadBaseObject = z.object({
  careerMapId: z.string(),
  name: z.string().optional(),
  startName: z.string().optional(),
  endName: z.string().optional(),
  type: CareerEventTypeSchema.default("working"),
  startDate: z.string(),
  endDate: z.string(),
  tags: z.array(z.string()),
  strength: z.number().int().min(1).max(5).default(3),
  row: z.number().int().min(0).default(0),
  description: z.string().nullable().default(null),
})

export const CareerEventPayloadBaseSchema = careerEventPayloadBaseObject.refine(
  (data) => !!(data.name || data.startName),
  { message: "name または startName のどちらかは必須です" }
)

export const CareerEventPayloadSchema = CareerEventPayloadBaseSchema

export const CareerEventTagSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const CareerEventSchema = CareerEventKeySchema.extend(careerEventPayloadBaseObject.shape).extend({
  tags: z.array(CareerEventTagSchema),
}).refine(
  (data) => !!(data.name || data.startName),
  { message: "name または startName のどちらかは必須です" }
)
export type CareerEvent = z.infer<typeof CareerEventSchema>
export type CareerEventPayload = z.infer<typeof CareerEventPayloadSchema>

/** 点イベント（startDate === endDate）: startName が必須 */
export type PointCareerEvent = Omit<CareerEvent, 'name' | 'endName'> & { startName: string }
/** 期間イベント（startDate !== endDate）: name が必須 */
export type DurationCareerEvent = Omit<CareerEvent, 'startName'> & { name: string }

export function isPointCareerEvent(event: CareerEvent): event is PointCareerEvent {
  return event.startDate === event.endDate
}

export function isDurationCareerEvent(event: CareerEvent): event is DurationCareerEvent {
  return event.startDate !== event.endDate
}

export const PagedCareerEventsSchema = createPagedItemsSchema(CareerEventSchema)
export type PagedCareerEvents = z.infer<typeof PagedCareerEventsSchema>
