import { z } from "zod"

import { Executor } from "@/core/application/executor"
import { DeleteCareerEventCommand, DeleteCareerEventCommandParametersSchema } from "@/core/application/port"
import { FindCareerEventQuery, FindCareerMapQuery } from "@/core/application/port"
import { CareerEvent } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util"

const DeleteCareerEventParametersSchema = DeleteCareerEventCommandParametersSchema

export type DeleteCareerEventParametersInput = z.input<typeof DeleteCareerEventParametersSchema>

export type DeleteCareerEventParameters = z.infer<typeof DeleteCareerEventParametersSchema>

export type DeleteCareerEvent = (
  input: DeleteCareerEventParametersInput,
  executor: Executor
) => Promise<AppResult<CareerEvent>>

export type MakeDeleteCareerEventDependencies = {
  deleteCareerEventCommand: DeleteCareerEventCommand
  findCareerEventQuery: FindCareerEventQuery
  findCareerMapQuery: FindCareerMapQuery
}

export function makeDeleteCareerEvent({
  deleteCareerEventCommand,
  findCareerEventQuery,
  findCareerMapQuery,
}: MakeDeleteCareerEventDependencies): DeleteCareerEvent {
  return async (input, executor) => {
    const validation = DeleteCareerEventParametersSchema.safeParse(input)
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

    const deleteResult = await deleteCareerEventCommand(parameters)
    if (!deleteResult.success) return deleteResult

    return succeed(careerEvent)
  }
}
