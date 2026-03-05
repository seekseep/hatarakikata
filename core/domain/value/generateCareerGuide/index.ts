import z from "zod"

export const GeneratedCareerGuideSectionSchema = z.object({
  title: z.string(),
  body: z.string(),
})

export const GeneratedCareerGuideActionSchema = z.object({
  type: z.enum(["learning", "job-change"]).default("learning"),
  title: z.string(),
  description: z.string(),
  url: z.string(),
})

export const GenerateCareerGuideResultSchema = z.object({
  content: z.object({
    sections: z.array(GeneratedCareerGuideSectionSchema),
  }),
  actions: z.array(GeneratedCareerGuideActionSchema),
})

export type GeneratedCareerGuideSection = z.infer<typeof GeneratedCareerGuideSectionSchema>
export type GeneratedCareerGuideAction = z.infer<typeof GeneratedCareerGuideActionSchema>
export type GenerateCareerGuideResult = z.infer<typeof GenerateCareerGuideResultSchema>
