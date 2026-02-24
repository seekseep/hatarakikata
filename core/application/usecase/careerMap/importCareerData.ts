import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import type { Executor } from "@/core/application/executor"
import type { CreateCareerEventCommand, CreateCareerMapCommand, CreateUserCommand } from "@/core/application/port/command"
import type { ListUserNamesQuery, ReadCareerDataQuery } from "@/core/application/port/query"
import type { CareerEvent } from "@/core/domain"
import { type AppResult, failAsConflictError, failAsForbiddenError, failAsInvalidParametersError, succeed } from "@/core/util/appResult"

const ImportCareerDataParametersSchema = z.object({
  personName: z.string().min(1),
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
  createUserCommand: CreateUserCommand
  createCareerMapCommand: CreateCareerMapCommand
  createCareerEventCommand: CreateCareerEventCommand
}

export function makeImportCareerData({
  readCareerDataQuery,
  listUserNamesQuery,
  createUserCommand,
  createCareerMapCommand,
  createCareerEventCommand,
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
      return failAsConflictError(`${parameters.personName} は既にインポート済みです`)
    }

    const dataResult = await readCareerDataQuery(parameters.personName)
    if (!dataResult.success) return dataResult

    const data = dataResult.data

    const userId = uuidv4()

    const userResult = await createUserCommand({ id: userId, name: data.personName })
    if (!userResult.success) return userResult

    const careerMapResult = await createCareerMapCommand({ userId, startDate: data.birthDate })
    if (!careerMapResult.success) return careerMapResult

    const careerMapId = careerMapResult.data.id
    const createdEvents: CareerEvent[] = []

    for (const event of data.events) {
      const { tagIds, ...rest } = event
      const result = await createCareerEventCommand({
        careerMapId,
        ...rest,
        tags: tagIds,
      })
      if (!result.success) throw new Error(`Failed to create event: ${result.error.message}`)
      createdEvents.push(result.data)
    }

    return succeed({
      userId,
      careerMapId,
      events: createdEvents,
    })
  }
}
