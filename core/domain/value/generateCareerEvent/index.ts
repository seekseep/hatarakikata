import z from "zod"

export const GenerateCareerEventQuestionSchema = z.object({
  content: z.string(),
})

const generatedCareerEventParameterObject = z.object({
  name: z.string().optional(),
  startName: z.string().optional(),
  endName: z.string().optional(),
  type: z.enum(["living", "working", "feeling"]).default("working"),
  startDate: z.string(),
  endDate: z.string(),
  tagNames: z.array(z.string()).default([]),
  strength: z.number().int().min(1).max(5).default(3),
  row: z.number().int().min(0).default(0),
  description: z.string().nullable().default(null),
})

export const GeneratedCareerEventParameterSchema = generatedCareerEventParameterObject.refine(
  (data) => !!(data.name || data.startName),
  { message: "name または startName のどちらかは必須です" }
)

export const GeneratedCareerEventUpdateParameterSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  startName: z.string().optional(),
  endName: z.string().optional(),
  type: z.enum(["living", "working", "feeling"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  tagNames: z.array(z.string()).optional(),
  strength: z.number().int().min(1).max(5).optional(),
  row: z.number().int().min(0).optional(),
  description: z.string().nullable().optional(),
})

export const GenerateCareerEventActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("create"), payload: GeneratedCareerEventParameterSchema }),
  z.object({ type: z.literal("update"), payload: GeneratedCareerEventUpdateParameterSchema }),
])

export const GenerateCareerEventsResultSchema = z.object({
  actions: z.array(GenerateCareerEventActionSchema),
  nextQuestion: GenerateCareerEventQuestionSchema.nullable(),
})

export type GenerateCareerEventQuestion = z.infer<typeof GenerateCareerEventQuestionSchema>
export type GeneratedCareerEventParameter = z.infer<typeof GeneratedCareerEventParameterSchema>
export type GeneratedCareerEventUpdateParameter = z.infer<typeof GeneratedCareerEventUpdateParameterSchema>
export type GenerateCareerEventAction = z.infer<typeof GenerateCareerEventActionSchema>
export type GenerateCareerEventsResult = z.infer<typeof GenerateCareerEventsResultSchema>
