import { z } from "zod"

import { PagedCareerEvents } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError } from "@/core/util/appResult"

import { Executor } from "../../executor"
import { FindCareerMapQuery, ListCareerEventsByCareerMapIdQuery, ListCareerEventsByCareerMapIdQueryParametersSchema } from "../../port/query"

const ListCareerEventsByCareerMapIdParametersSchema = ListCareerEventsByCareerMapIdQueryParametersSchema

export type ListCareerEventsByCareerMapIdParametersInput = z.input<typeof ListCareerEventsByCareerMapIdParametersSchema>

export type ListCareerEventsByCareerMapIdParameters = z.infer<typeof ListCareerEventsByCareerMapIdParametersSchema>

export type ListCareerEventsByCareerMapId = (
  input: ListCareerEventsByCareerMapIdParametersInput,
  executor: Executor
) => Promise<AppResult<PagedCareerEvents>>

export type MakeListCareerEventsByCareerMapIdDependencies = {
  listCareerEventsByCareerMapIdQuery: ListCareerEventsByCareerMapIdQuery
  findCareerMapQuery: FindCareerMapQuery
}

export function makeListCareerEventsByCareerMapId({
  listCareerEventsByCareerMapIdQuery,
  findCareerMapQuery,
}: MakeListCareerEventsByCareerMapIdDependencies): ListCareerEventsByCareerMapId {
  return async (input, executor) => {
    const validation = ListCareerEventsByCareerMapIdParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general") return failAsForbiddenError("Forbidden")

    const parameters = validation.data
    const { careerMapId } = parameters

    const findCareerMapResult = await findCareerMapQuery({ id: careerMapId })
    if (!findCareerMapResult.success) return findCareerMapResult

    const careerMap = findCareerMapResult.data
    if (!careerMap) return failAsNotFoundError("Career map is not found")

    return await listCareerEventsByCareerMapIdQuery({ careerMapId })
  }
}
