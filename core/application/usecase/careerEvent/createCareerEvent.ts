import { z } from "zod"

import { Executor } from "@/core/application/executor"
import { CreateCareerEventCommand, CreateCareerEventCommandParametersSchema } from "@/core/application/port"
import { FindCareerMapQuery } from "@/core/application/port"
import { CareerEvent } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError } from "@/core/util"

const CreateCareerEventParametersSchema = CreateCareerEventCommandParametersSchema

export type CreateCareerEventParametersInput = z.input<typeof CreateCareerEventParametersSchema>

export type CreateCareerEventParameters = z.infer<typeof CreateCareerEventParametersSchema>

export type CreateCareerEvent = (
  input: CreateCareerEventParametersInput,
  executor: Executor
) => Promise<AppResult<CareerEvent>>

export type MakeCreateCareerEventDependencies = {
  createCareerEventCommand: CreateCareerEventCommand
  findCareerMapQuery: FindCareerMapQuery
}

export function makeCreateCareerEvent({
  createCareerEventCommand,
  findCareerMapQuery,
}: MakeCreateCareerEventDependencies): CreateCareerEvent {
  return async (input, executor) => {
    const validation = CreateCareerEventParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general") return failAsForbiddenError("Forbidden")

    const parameters = validation.data
    const { careerMapId } = parameters

    const findCareerMapResult = await findCareerMapQuery({ id: careerMapId })
    if (!findCareerMapResult.success) return findCareerMapResult

    const careerMap = findCareerMapResult.data
    if (!careerMap) return failAsNotFoundError("Career map is not found")

    if (careerMap.userId !== executor.user.id) {
      return failAsForbiddenError("Forbidden")
    }

    return await createCareerEventCommand(parameters)
  }
}
