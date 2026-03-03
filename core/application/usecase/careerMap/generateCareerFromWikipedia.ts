import { z } from "zod"

import type { Executor } from "@/core/application/executor"
import type { SaveCareerDataCommand } from "@/core/application/port/command/careerData/saveCareerDataCommand"
import type { SaveWikipediaMarkdownCacheCommand } from "@/core/application/port/command/wikipedia/saveWikipediaMarkdownCacheCommand"
import type { FetchWikipediaBiographyOperation } from "@/core/application/port/operation/fetchWikipediaBiography"
import type { GenerateCareerEventsFromBiographyOperation } from "@/core/application/port/operation/generateCareerEventsFromBiography"
import type { ListCareerDataQuery } from "@/core/application/port/query/careerData/listCareerDataQuery"
import type { ListCareerMapEventTagsQuery } from "@/core/application/port/query"
import type { ReadWikipediaMarkdownCacheQuery } from "@/core/application/port/query/wikipedia/readWikipediaMarkdownCacheQuery"
import type { GeneratedCareerEventParameter } from "@/core/domain"
import { type AppResult, failAsConflictError, failAsForbiddenError, failAsInvalidParametersError, succeed } from "@/core/util/appResult"

const GenerateCareerFromWikipediaParametersSchema = z.object({
  personName: z.string().min(1),
  language: z.string().default("ja"),
})

export type GenerateCareerFromWikipediaParametersInput = z.input<
  typeof GenerateCareerFromWikipediaParametersSchema
>

export type GenerateCareerFromWikipediaResult = {
  personName: string
  language: string
  wikipediaUrl: string
  wikipediaTitle: string
  birthDate: string | null
  events: GeneratedCareerEventParameter[]
}

export type GenerateCareerFromWikipediaUsecase = (
  input: GenerateCareerFromWikipediaParametersInput,
  executor: Executor
) => Promise<AppResult<GenerateCareerFromWikipediaResult>>

export type MakeGenerateCareerFromWikipediaDependencies = {
  fetchWikipediaBiography: FetchWikipediaBiographyOperation
  generateCareerEventsFromBiography: GenerateCareerEventsFromBiographyOperation
  listCareerDataQuery: ListCareerDataQuery
  listCareerMapEventTagsQuery: ListCareerMapEventTagsQuery
  readWikipediaMarkdownCacheQuery: ReadWikipediaMarkdownCacheQuery
  saveCareerDataCommand: SaveCareerDataCommand
  saveWikipediaMarkdownCacheCommand: SaveWikipediaMarkdownCacheCommand
}

export function makeGenerateCareerFromWikipedia({
  fetchWikipediaBiography,
  generateCareerEventsFromBiography,
  listCareerDataQuery,
  listCareerMapEventTagsQuery,
  readWikipediaMarkdownCacheQuery,
  saveCareerDataCommand,
  saveWikipediaMarkdownCacheCommand,
}: MakeGenerateCareerFromWikipediaDependencies): GenerateCareerFromWikipediaUsecase {
  return async (input, executor) => {
    const validation = GenerateCareerFromWikipediaParametersSchema.safeParse(input)
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

    const cacheResult = await readWikipediaMarkdownCacheQuery(parameters.personName)
    if (!cacheResult.success) return cacheResult

    let biography: { title: string; content: string; url: string }

    if (cacheResult.data !== null) {
      biography = cacheResult.data
    } else {
      const fetchResult = await fetchWikipediaBiography({
        personName: parameters.personName,
        language: parameters.language,
      })
      if (!fetchResult.success) return fetchResult

      const saveResult = await saveWikipediaMarkdownCacheCommand(parameters.personName, fetchResult.data)
      if (!saveResult.success) return saveResult

      biography = fetchResult.data
    }

    const generateResult = await generateCareerEventsFromBiography({
      personName: parameters.personName,
      biographyMarkdown: biography.content,
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
      wikipediaUrl: biography.url,
      wikipediaTitle: biography.title,
      birthDate,
      events,
    }

    const saveResult = await saveCareerDataCommand(data)
    if (!saveResult.success) return saveResult

    return succeed(data)
  }
}
