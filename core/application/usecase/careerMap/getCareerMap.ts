import { z } from "zod"

import { CareerMap } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util/appResult"

import { Executor } from "../../executor"
import { FindCareerMapQuery, FindCareerMapQueryParametersSchema } from "../../port/query"

const GetCareerMapParametersSchema = FindCareerMapQueryParametersSchema

export type GetCareerMapParametersInput = z.input<typeof GetCareerMapParametersSchema>

export type GetCareerMapParameters = z.infer<typeof GetCareerMapParametersSchema>

export type GetCareerMap = (
  input: GetCareerMapParametersInput,
  executor: Executor
) => Promise<AppResult<CareerMap>>

export type MakeGetCareerMapDependencies = {
  findCareerMapQuery: FindCareerMapQuery
}

export function makeGetCareerMap({
  findCareerMapQuery,
}: MakeGetCareerMapDependencies): GetCareerMap {
  return async (input, executor) => {
    const validation = GetCareerMapParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general") return failAsForbiddenError("Forbidden")

    const parameters = validation.data

    const findCareerMapResult = await findCareerMapQuery({ id: parameters.id })
    if (!findCareerMapResult.success) return findCareerMapResult

    const careerMap = findCareerMapResult.data
    if (!careerMap) return failAsNotFoundError("Career map is not found")

    return succeed(careerMap)
  }
}
