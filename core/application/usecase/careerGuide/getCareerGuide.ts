import { z } from "zod"

import { Executor } from "@/core/application/executor"
import { FindCareerGuideQuery } from "@/core/application/port"
import { CareerGuide, CareerGuideKeySchema } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util"

const GetCareerGuideParametersSchema = CareerGuideKeySchema

export type GetCareerGuideParametersInput = z.input<typeof GetCareerGuideParametersSchema>

export type GetCareerGuide = (
  input: GetCareerGuideParametersInput,
  executor: Executor
) => Promise<AppResult<CareerGuide>>

export type MakeGetCareerGuideDependencies = {
  findCareerGuideQuery: FindCareerGuideQuery
}

export function makeGetCareerGuide({
  findCareerGuideQuery,
}: MakeGetCareerGuideDependencies): GetCareerGuide {
  return async (input, executor) => {
    const validation = GetCareerGuideParametersSchema.safeParse(input)
    if (!validation.success)
      return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general")
      return failAsForbiddenError("Forbidden")

    const { id } = validation.data

    const findResult = await findCareerGuideQuery({ id })
    if (!findResult.success) return findResult
    if (!findResult.data) return failAsNotFoundError("CareerGuide not found")

    const guide = findResult.data

    if (guide.userId !== executor.user.id)
      return failAsForbiddenError("Forbidden")

    return succeed(guide)
  }
}
