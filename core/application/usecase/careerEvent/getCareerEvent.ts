import { z } from "zod"

import { Executor } from "@/core/application/executor"
import { FindCareerEventQuery, FindCareerEventQueryParametersSchema, FindCareerMapQuery } from "@/core/application/port"
import { CareerEvent } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util"

const GetCareerEventParametersSchema = FindCareerEventQueryParametersSchema

export type GetCareerEventParametersInput = z.input<typeof GetCareerEventParametersSchema>

export type GetCareerEventParameters = z.infer<typeof GetCareerEventParametersSchema>

export type GetCareerEvent = (
  input: GetCareerEventParametersInput,
  executor: Executor
) => Promise<AppResult<CareerEvent>>

export type MakeGetCareerEventDependencies = {
  findCareerEventQuery: FindCareerEventQuery
  findCareerMapQuery: FindCareerMapQuery
}

export function makeGetCareerEvent({
  findCareerEventQuery,
  findCareerMapQuery,
}: MakeGetCareerEventDependencies): GetCareerEvent {
  return async (input, executor) => {
    const validation = GetCareerEventParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general") return failAsForbiddenError("Forbidden")

    const parameters = validation.data

    const findCareerEventResult = await findCareerEventQuery({ id: parameters.id })
    if (!findCareerEventResult.success) return findCareerEventResult

    const careerEvent = findCareerEventResult.data
    if (!careerEvent) return failAsNotFoundError("Career event is not found")

    const findCareerMapResult = await findCareerMapQuery({ id: careerEvent.careerMapId })
    if (!findCareerMapResult.success) return findCareerMapResult

    const careerMap = findCareerMapResult.data
    if (!careerMap) return failAsNotFoundError("Career map is not found")

    if (careerMap.userId !== executor.user.id) {
      return failAsForbiddenError("Forbidden")
    }

    return succeed(careerEvent)
  }
}
