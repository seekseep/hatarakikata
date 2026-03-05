import { z } from "zod"

import type { Executor } from "@/core/application/executor"
import type { SaveWikipediaMarkdownCacheCommand } from "@/core/application/port/command/wikipedia/saveWikipediaMarkdownCacheCommand"
import type { FetchWikipediaBiographyOperation } from "@/core/application/port/operation/fetchWikipediaBiography"
import type { ReadWikipediaMarkdownCacheQuery } from "@/core/application/port/query/wikipedia/readWikipediaMarkdownCacheQuery"
import { type AppResult, failAsForbiddenError, failAsInvalidParametersError, succeed } from "@/core/util/appResult"

const DownloadWikipediaBiographyParametersSchema = z.object({
  personName: z.string().min(1),
  language: z.string().default("ja"),
})

export type DownloadWikipediaBiographyParametersInput = z.input<
  typeof DownloadWikipediaBiographyParametersSchema
>

export type DownloadWikipediaBiographyResult = {
  title: string
  content: string
  url: string
}

export type DownloadWikipediaBiographyUsecase = (
  input: DownloadWikipediaBiographyParametersInput,
  executor: Executor
) => Promise<AppResult<DownloadWikipediaBiographyResult>>

export type MakeDownloadWikipediaBiographyDependencies = {
  fetchWikipediaBiography: FetchWikipediaBiographyOperation
  readWikipediaMarkdownCacheQuery: ReadWikipediaMarkdownCacheQuery
  saveWikipediaMarkdownCacheCommand: SaveWikipediaMarkdownCacheCommand
}

export function makeDownloadWikipediaBiography({
  fetchWikipediaBiography,
  readWikipediaMarkdownCacheQuery,
  saveWikipediaMarkdownCacheCommand,
}: MakeDownloadWikipediaBiographyDependencies): DownloadWikipediaBiographyUsecase {
  return async (input, executor) => {
    const validation = DownloadWikipediaBiographyParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "system") {
      return failAsForbiddenError("Forbidden")
    }

    const parameters = validation.data

    const cacheResult = await readWikipediaMarkdownCacheQuery(parameters.personName)
    if (!cacheResult.success) return cacheResult

    if (cacheResult.data !== null) {
      return succeed(cacheResult.data)
    }

    const fetchResult = await fetchWikipediaBiography({
      personName: parameters.personName,
      language: parameters.language,
    })
    if (!fetchResult.success) return fetchResult

    const saveResult = await saveWikipediaMarkdownCacheCommand(parameters.personName, fetchResult.data)
    if (!saveResult.success) return saveResult

    return succeed(fetchResult.data)
  }
}
