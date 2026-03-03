import * as fs from 'fs'
import * as path from 'path'

import type { SaveWikipediaMarkdownCacheCommand } from "@/core/application/port/command/wikipedia/saveWikipediaMarkdownCacheCommand"
import { failAsExternalServiceError, succeed } from "@/core/util/appResult"

const WIKIPEDIA_CACHE_DIR = path.resolve(process.cwd(), 'data/wikipedia')

export const saveWikipediaMarkdownCacheCommand: SaveWikipediaMarkdownCacheCommand = async (personName, cache) => {
  try {
    if (!fs.existsSync(WIKIPEDIA_CACHE_DIR)) {
      fs.mkdirSync(WIKIPEDIA_CACHE_DIR, { recursive: true })
    }

    const safeName = personName.replace(/[/\\]/g, '_')
    const mdPath = path.join(WIKIPEDIA_CACHE_DIR, `${safeName}.md`)
    const metaPath = path.join(WIKIPEDIA_CACHE_DIR, `${safeName}.json`)

    fs.writeFileSync(mdPath, cache.content, 'utf-8')
    fs.writeFileSync(
      metaPath,
      JSON.stringify({ title: cache.title, url: cache.url }, null, 2),
      'utf-8'
    )

    return succeed(undefined)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
