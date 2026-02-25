import { z } from "zod"

import type { Executor } from "@/core/application/executor"
import type { CreateCareerEventCommand, CreateCareerMapCommand, CreateUserCommand } from "@/core/application/port/command"
import type { CreateAuthUserOperation } from "@/core/application/port/operation/createAuthUser"
import type { FetchWikipediaBiographyOperation } from "@/core/application/port/operation/fetchWikipediaBiography"
import type { GenerateCareerEventsFromBiographyOperation } from "@/core/application/port/operation/generateCareerEventsFromBiography"
import type { ListCareerMapEventTagsQuery } from "@/core/application/port/query"
import type { CareerEvent } from "@/core/domain"
import { type AppResult, failAsForbiddenError, failAsInvalidParametersError, succeed } from "@/core/util/appResult"

const ImportCareerFromWikipediaParametersSchema = z.object({
  personName: z.string().min(1),
  language: z.string().default("ja"),
})

export type ImportCareerFromWikipediaParametersInput = z.input<
  typeof ImportCareerFromWikipediaParametersSchema
>

type ImportCareerFromWikipediaResult = {
  personName: string
  wikipediaUrl: string
  userId: string
  careerMapId: string
  events: CareerEvent[]
}

export type ImportCareerFromWikipediaUsecase = (
  input: ImportCareerFromWikipediaParametersInput,
  executor: Executor
) => Promise<AppResult<ImportCareerFromWikipediaResult>>

export type MakeImportCareerFromWikipediaDependencies = {
  fetchWikipediaBiography: FetchWikipediaBiographyOperation
  generateCareerEventsFromBiography: GenerateCareerEventsFromBiographyOperation
  createAuthUser: CreateAuthUserOperation
  createUserCommand: CreateUserCommand
  createCareerMapCommand: CreateCareerMapCommand
  createCareerEventCommand: CreateCareerEventCommand
  listCareerMapEventTagsQuery: ListCareerMapEventTagsQuery
}

export function makeImportCareerFromWikipedia({
  fetchWikipediaBiography,
  generateCareerEventsFromBiography,
  createAuthUser,
  createUserCommand,
  createCareerMapCommand,
  createCareerEventCommand,
  listCareerMapEventTagsQuery,
}: MakeImportCareerFromWikipediaDependencies): ImportCareerFromWikipediaUsecase {
  return async (input, executor) => {
    const validation = ImportCareerFromWikipediaParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "system") {
      return failAsForbiddenError("Forbidden")
    }

    const parameters = validation.data

    const tagResult = await listCareerMapEventTagsQuery()
    if (!tagResult.success) return tagResult

    const tags = tagResult.data.items.map((tag) => ({ id: tag.id, name: tag.name }))
    const tagIdByName = new Map(tags.map((t) => [t.name, t.id]))
    const resolveTagIds = (names: string[]): string[] =>
      names.map((n) => tagIdByName.get(n)).filter((id): id is string => !!id)

    const biographyResult = await fetchWikipediaBiography({
      personName: parameters.personName,
      language: parameters.language,
    })
    if (!biographyResult.success) return biographyResult

    const generateResult = await generateCareerEventsFromBiography({
      personName: parameters.personName,
      biographyMarkdown: biographyResult.data.markdown,
      birthDate: null,
      tags,
    })
    if (!generateResult.success) return generateResult

    const createActions = generateResult.data.actions.filter((a) => a.type === "create")
    if (createActions.length === 0) {
      return failAsInvalidParametersError("No career events were generated from the biography")
    }

    // Estimate birthDate from the earliest event's startDate
    let birthDate: string | null = null
    for (const action of createActions) {
      if (action.type === "create") {
        const sd = action.payload.startDate
        if (!birthDate || sd < birthDate) birthDate = sd
      }
    }

    // Create auth user with random email/password
    const randomId = crypto.randomUUID()
    const email = `wikipedia-${randomId}@import.local`
    const password = crypto.randomUUID()

    const authResult = await createAuthUser({ email, password })
    if (!authResult.success) return authResult

    const userId = authResult.data.id

    const userResult = await createUserCommand({ id: userId, name: parameters.personName })
    if (!userResult.success) return userResult

    const careerMapResult = await createCareerMapCommand({ userId, startDate: birthDate })
    if (!careerMapResult.success) return careerMapResult

    const careerMapId = careerMapResult.data.id
    const createdEvents: CareerEvent[] = []

    for (const action of createActions) {
      if (action.type === "create") {
        const { tagNames, ...rest } = action.payload
        const result = await createCareerEventCommand({
          careerMapId,
          ...rest,
          tags: resolveTagIds(tagNames),
        })
        if (!result.success) throw new Error(`Failed to create event: ${result.error.message}`)
        createdEvents.push(result.data)
      }
    }

    return succeed({
      personName: parameters.personName,
      wikipediaUrl: biographyResult.data.url,
      userId,
      careerMapId,
      events: createdEvents,
    })
  }
}
