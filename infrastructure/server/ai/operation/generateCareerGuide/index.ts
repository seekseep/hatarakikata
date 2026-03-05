import type { GenerateCareerGuideOperation } from "@/core/application/port/operation/generateCareerGuide"
import { GenerateCareerGuideResultSchema } from "@/core/application/port/operation/generateCareerGuide"
import { failAsExternalServiceError, succeed } from "@/core/util/appResult"

import { createOpenAIClient } from "../../client"
import { buildGenerateCareerGuidePrompt } from "./prompt"

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-nano"

export const generateCareerGuideOperation: GenerateCareerGuideOperation = async (parameters) => {
  const client = createOpenAIClient()

  const prompt = buildGenerateCareerGuidePrompt(
    parameters.userName,
    parameters.baseCareerEvents,
    parameters.guideCareerMapName,
    parameters.guideCareerEvents
  )

  try {
    const response = await client.responses.create({
      model: MODEL,
      input: prompt,
      text: { format: { type: "json_object" } },
    })

    const text = response.output_text
    if (!text) return failAsExternalServiceError("OpenAI returned empty response")

    const parsed = GenerateCareerGuideResultSchema.safeParse(JSON.parse(text))
    if (!parsed.success) return failAsExternalServiceError(parsed.error.message, parsed.error)

    return succeed(parsed.data)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
