import type { GenerateCareerEventsFromBiographyOperation } from "@/core/application/port/operation/generateCareerEventsFromBiography"
import { failAsExternalServiceError, succeed } from "@/core/util/appResult"

import { createOpenAIClient } from "../../client"
import { normalizeActions } from "../../converter"
import { buildBiographyPromptForType } from "./prompt"

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-nano"

const EVENT_TYPES = ["working", "living", "feeling"] as const

export const generateCareerEventsFromBiography: GenerateCareerEventsFromBiographyOperation = async (parameters) => {
  const today = new Date().toISOString().slice(0, 10)
  const fallbackDate = parameters.birthDate ?? today

  const client = createOpenAIClient()

  try {
    const tagNames = parameters.tags.map((t) => t.name)

    const results = await Promise.all(
      EVENT_TYPES.map((type) => {
        const prompt = buildBiographyPromptForType(
          type,
          parameters.personName,
          parameters.biographyMarkdown,
          parameters.birthDate,
          tagNames
        )
        return client.responses.create({
          model: MODEL,
          input: prompt,
          text: { format: { type: "json_object" } },
        })
      })
    )

    const allActions = results.flatMap((response) => {
      const text = response.output_text
      if (!text) return []
      const parsed = JSON.parse(text)
      return parsed.actions ?? []
    })

    const actions = normalizeActions(allActions, fallbackDate, parameters.tags)

    return succeed({ actions, nextQuestion: null })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
