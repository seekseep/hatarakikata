import type { FetchWikipediaBiographyOperationResult } from "@/core/application/port/operation/fetchWikipediaBiography"
import type { AppResult } from "@/core/util/appResult"

export type WikipediaMarkdownCache = FetchWikipediaBiographyOperationResult

export type ReadWikipediaMarkdownCacheQuery = (
  personName: string
) => Promise<AppResult<WikipediaMarkdownCache | null>>
