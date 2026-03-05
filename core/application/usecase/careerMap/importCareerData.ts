import { z } from "zod"

import type { Executor } from "@/core/application/executor"
import type { CreateAuthUserCommand, CreateCareerEventCommand, CreateCareerMapCommand, CreateUserCommand, DeleteUserCommand } from "@/core/application/port/command"
import type { FindUserByNameQuery, ListCareerMapEventTagsQuery, ListUserNamesQuery, ReadCareerDataQuery } from "@/core/application/port/query"
import type { CareerEvent } from "@/core/domain"
import { type AppResult, failAsConflictError, failAsForbiddenError, failAsInvalidParametersError, succeed } from "@/core/util/appResult"

const ImportCareerDataParametersSchema = z.object({
  personName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  force: z.boolean().default(false),
})

export type ImportCareerDataParametersInput = z.input<
  typeof ImportCareerDataParametersSchema
>

type ImportCareerDataResult = {
  userId: string
  careerMapId: string
  events: CareerEvent[]
}

export type ImportCareerDataUsecase = (
  input: ImportCareerDataParametersInput,
  executor: Executor
) => Promise<AppResult<ImportCareerDataResult>>

export type MakeImportCareerDataDependencies = {
  readCareerDataQuery: ReadCareerDataQuery
  listUserNamesQuery: ListUserNamesQuery
  findUserByNameQuery: FindUserByNameQuery
  listCareerMapEventTagsQuery: ListCareerMapEventTagsQuery
  createAuthUserCommand: CreateAuthUserCommand
  createUserCommand: CreateUserCommand
  createCareerMapCommand: CreateCareerMapCommand
  createCareerEventCommand: CreateCareerEventCommand
  deleteUserCommand: DeleteUserCommand
}

export function makeImportCareerData({
  readCareerDataQuery,
  listUserNamesQuery,
  findUserByNameQuery,
  listCareerMapEventTagsQuery,
  createAuthUserCommand,
  createUserCommand,
  createCareerMapCommand,
  createCareerEventCommand,
  deleteUserCommand,
}: MakeImportCareerDataDependencies): ImportCareerDataUsecase {
  return async (input, executor) => {
    const validation = ImportCareerDataParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "system") {
      return failAsForbiddenError("Forbidden")
    }

    const parameters = validation.data

    const existingUsers = await listUserNamesQuery()
    if (!existingUsers.success) return existingUsers
    if (existingUsers.data.names.includes(parameters.personName)) {
      if (!parameters.force) {
        return failAsConflictError(`${parameters.personName} は既にインポート済みです`)
      }
      const existingUser = await findUserByNameQuery(parameters.personName)
      if (!existingUser.success) return existingUser
      if (existingUser.data) {
        const deleteResult = await deleteUserCommand({ id: existingUser.data.id })
        if (!deleteResult.success) return deleteResult
      }
    }

    const dataResult = await readCareerDataQuery(parameters.personName)
    if (!dataResult.success) return dataResult

    const tagResult = await listCareerMapEventTagsQuery()
    if (!tagResult.success) return tagResult
    const tagIdByName = new Map(tagResult.data.items.map((t) => [t.name, t.id]))
    const resolveTagIds = (names: string[]): string[] =>
      names.map((n) => tagIdByName.get(n)).filter((id): id is string => !!id)

    const data = dataResult.data

    const authResult = await createAuthUserCommand({
      email: parameters.email,
      password: parameters.password,
    })
    if (!authResult.success) return authResult

    const userId = authResult.data.id

    const userResult = await createUserCommand({ id: userId, name: data.personName })
    if (!userResult.success) return userResult

    const careerMapResult = await createCareerMapCommand({ userId, startDate: data.birthDate })
    if (!careerMapResult.success) return careerMapResult

    const careerMapId = careerMapResult.data.id
    const createdEvents: CareerEvent[] = []

    const eventResults = await Promise.all(
      data.events.map(async (event) => {
        const { tagNames, ...rest } = event
        const result = await createCareerEventCommand({
          careerMapId,
          ...rest,
          tags: resolveTagIds(tagNames),
        })
        if (!result.success) throw new Error(`Failed to create event: ${result.error.message}`)
        return result.data
      })
    )
    createdEvents.push(...eventResults)

    return succeed({
      userId,
      careerMapId,
      events: createdEvents,
    })
  }
}
