import type { WikipediaMarkdownCache } from "@/core/application/port/query/wikipedia/readWikipediaMarkdownCacheQuery"
import type { AppResult } from "@/core/util/appResult"

export type SaveWikipediaMarkdownCacheCommand = (
  personName: string,
  cache: WikipediaMarkdownCache
) => Promise<AppResult<void>>
