import * as fs from 'fs'
import * as path from 'path'

import type { ReadWikipediaMarkdownCacheQuery } from "@/core/application/port/query/wikipedia/readWikipediaMarkdownCacheQuery"
import { failAsExternalServiceError, succeed } from "@/core/util/appResult"

const WIKIPEDIA_CACHE_DIR = path.resolve(process.cwd(), 'data/wikipedia')

export const readWikipediaMarkdownCacheQuery: ReadWikipediaMarkdownCacheQuery = async (personName) => {
  try {
    const safeName = personName.replace(/[/\\]/g, '_')
    const mdPath = path.join(WIKIPEDIA_CACHE_DIR, `${safeName}.md`)
    const metaPath = path.join(WIKIPEDIA_CACHE_DIR, `${safeName}.json`)

    if (!fs.existsSync(mdPath) || !fs.existsSync(metaPath)) {
      return succeed(null)
    }

    const content = fs.readFileSync(mdPath, 'utf-8')
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as { title: string; url: string }

    return succeed({ title: meta.title, content, url: meta.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
