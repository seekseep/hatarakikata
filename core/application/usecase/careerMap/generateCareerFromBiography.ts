import { z } from "zod"

import type { Executor } from "@/core/application/executor"
import type { SaveCareerDataCommand } from "@/core/application/port/command/careerData/saveCareerDataCommand"
import type { GenerateCareerEventsFromBiographyOperation } from "@/core/application/port/operation/generateCareerEventsFromBiography"
import type { ListCareerMapEventTagsQuery } from "@/core/application/port/query"
import type { ListCareerDataQuery } from "@/core/application/port/query/careerData/listCareerDataQuery"
import type { GeneratedCareerEventParameter } from "@/core/domain"
import { type AppResult, failAsConflictError, failAsForbiddenError, failAsInvalidParametersError, succeed } from "@/core/util/appResult"

const GenerateCareerFromBiographyParametersSchema = z.object({
  personName: z.string().min(1),
  language: z.string().default("ja"),
  biographyMarkdown: z.string().min(1),
  wikipediaUrl: z.string().min(1),
  wikipediaTitle: z.string().min(1),
})

export type GenerateCareerFromBiographyParametersInput = z.input<
  typeof GenerateCareerFromBiographyParametersSchema
>

export type GenerateCareerFromBiographyResult = {
  personName: string
  language: string
  wikipediaUrl: string
  wikipediaTitle: string
  birthDate: string | null
  events: GeneratedCareerEventParameter[]
}

export type GenerateCareerFromBiographyUsecase = (
  input: GenerateCareerFromBiographyParametersInput,
  executor: Executor
) => Promise<AppResult<GenerateCareerFromBiographyResult>>

export type MakeGenerateCareerFromBiographyDependencies = {
  generateCareerEventsFromBiography: GenerateCareerEventsFromBiographyOperation
  listCareerDataQuery: ListCareerDataQuery
  listCareerMapEventTagsQuery: ListCareerMapEventTagsQuery
  saveCareerDataCommand: SaveCareerDataCommand
}

export function makeGenerateCareerFromBiography({
  generateCareerEventsFromBiography,
  listCareerDataQuery,
  listCareerMapEventTagsQuery,
  saveCareerDataCommand,
}: MakeGenerateCareerFromBiographyDependencies): GenerateCareerFromBiographyUsecase {
  return async (input, executor) => {
    const validation = GenerateCareerFromBiographyParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "system") {
      return failAsForbiddenError("Forbidden")
    }

    const parameters = validation.data

    const existingData = await listCareerDataQuery()
    if (!existingData.success) return existingData
    if (existingData.data.names.includes(parameters.personName)) {
      return failAsConflictError(`${parameters.personName} のデータは既に存在します`)
    }

    const tagResult = await listCareerMapEventTagsQuery()
    if (!tagResult.success) return tagResult

    const tags = tagResult.data.items.map((tag) => ({ id: tag.id, name: tag.name }))

    const generateResult = await generateCareerEventsFromBiography({
      personName: parameters.personName,
      biographyMarkdown: parameters.biographyMarkdown,
      birthDate: null,
      tags,
    })
    if (!generateResult.success) return generateResult

    const createActions = generateResult.data.actions.filter((a) => a.type === "create")
    if (createActions.length === 0) {
      return failAsInvalidParametersError("No career events were generated from the biography")
    }

    const events: GeneratedCareerEventParameter[] = []
    let birthDate: string | null = null

    for (const action of createActions) {
      if (action.type === "create") {
        events.push(action.payload)
        const sd = action.payload.startDate
        if (!birthDate || sd < birthDate) birthDate = sd
      }
    }

    const data = {
      personName: parameters.personName,
      language: parameters.language,
      wikipediaUrl: parameters.wikipediaUrl,
      wikipediaTitle: parameters.wikipediaTitle,
      birthDate,
      events,
    }

    const saveResult = await saveCareerDataCommand(data)
    if (!saveResult.success) return saveResult

    return succeed(data)
  }
}
