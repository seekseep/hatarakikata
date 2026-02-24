import axios from "axios"
import TurndownService from "turndown"
import wikipedia from "wikipedia"

import type { FetchWikipediaBiographyOperation } from "@/core/application/port/operation/fetchWikipediaBiography"
import { failAsExternalServiceError, failAsNotFoundError, succeed } from "@/core/util/appResult"

const USER_AGENT = 'hatarakikata/1.0 (https://github.com/study-basic-hackathon/hatarakikata)'

export const fetchWikipediaBiography: FetchWikipediaBiographyOperation = async (parameters) => {
  try {
    axios.defaults.headers.common['User-Agent'] = USER_AGENT
    wikipedia.setLang(parameters.language)
    wikipedia.setUserAgent(USER_AGENT)

    const searchResults = await wikipedia.search(parameters.personName, { limit: 1 })
    if (searchResults.results.length === 0) {
      return failAsNotFoundError(`Wikipedia page not found for: ${parameters.personName}`)
    }

    const page = await wikipedia.page(searchResults.results[0].title)
    const html = await page.html()
    const url = page.fullurl

    const turndownService = new TurndownService()
    const markdown = turndownService.turndown(html)

    return succeed({
      title: page.title,
      markdown,
      url,
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return failAsNotFoundError(`Wikipedia page not found for: ${parameters.personName}`, error)
    }
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
