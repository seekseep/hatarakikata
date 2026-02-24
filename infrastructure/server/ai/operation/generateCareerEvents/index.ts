import type { GenerateCareerEventsOperation } from "@/core/application/port/operation"
import { failAsExternalServiceError, succeed } from "@/core/util/appResult"

import { createOpenAIClient } from "../../client"
import { normalizeActions } from "../../converter"
import { buildPrompt } from "./prompt"

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-nano"

export const generateCareerEvents: GenerateCareerEventsOperation = async (parameters) => {
  const today = new Date().toISOString().slice(0, 10)
  const fallbackDate = parameters.map.startDate ?? today

  const tagNames = parameters.tags.map((t) => t.name)

  const prompt = buildPrompt(
    parameters.question,
    parameters.previousQuestion,
    parameters.map.startDate ?? "",
    parameters.content,
    tagNames
  )

  const client = createOpenAIClient()

  try {
    const response = await client.responses.create({
      model: MODEL,
      input: prompt,
      text: { format: { type: "json_object" } },
    })

    const text = response.output_text
    if (!text) return failAsExternalServiceError("OpenAI returned empty response")

    const parsed = JSON.parse(text)
    const actions = normalizeActions(parsed.actions ?? [], fallbackDate, parameters.tags)
    const nextQuestion = parsed.nextQuestion ? { content: parsed.nextQuestion.content } : null

    return succeed({ actions, nextQuestion })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
