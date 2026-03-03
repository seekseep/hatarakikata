import z from "zod"

export const CareerQuestionFieldTypeSchema = z.enum([
  "checkbox",
  "text",
  "date",
  "number",
  "select",
  "radio",
])
export type CareerQuestionFieldType = z.infer<typeof CareerQuestionFieldTypeSchema>

export const CareerQuestionFieldConditionExpressionSchema = z.object({
  name: z.string(),
  value: z.unknown(),
})
export type CareerQuestionFieldConditionExpression = z.infer<typeof CareerQuestionFieldConditionExpressionSchema>

export const CareerQuestionFieldConditionSchema = z.object({
  or: z.array(CareerQuestionFieldConditionExpressionSchema).optional(),
  and: z.array(CareerQuestionFieldConditionExpressionSchema).optional(),
})
export type CareerQuestionFieldCondition = z.infer<typeof CareerQuestionFieldConditionSchema>

export const CareerQuestionFieldSchema = z.object({
  name: z.string(),
  binding: z.string().nullable(),
  label: z.string(),
  type: CareerQuestionFieldTypeSchema,
  options: z.array(z.string()).optional(),
  condition: CareerQuestionFieldConditionSchema.optional(),
})
export type CareerQuestionField = z.infer<typeof CareerQuestionFieldSchema>

export const CareerQuestionStatusSchema = z.enum(["open", "closed"])
export type CareerQuestionStatus = z.infer<typeof CareerQuestionStatusSchema>

export const CareerQuestionKeySchema = z.object({
  id: z.string(),
})

export const CareerQuestionPayloadSchema = z.object({
  userId: z.string(),
  name: z.string(),
  status: CareerQuestionStatusSchema.default("open"),
  fields: z.array(CareerQuestionFieldSchema),
})

export const CareerQuestionSchema = CareerQuestionKeySchema.extend(
  CareerQuestionPayloadSchema.shape
)
export type CareerQuestion = z.infer<typeof CareerQuestionSchema>
export type CareerQuestionPayload = z.infer<typeof CareerQuestionPayloadSchema>
