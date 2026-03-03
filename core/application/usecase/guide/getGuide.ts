import { z } from "zod"

import { Guide, GuideKeySchema } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util/appResult"

import { Executor } from "../../executor"
import { FindGuideQuery } from "../../port/query"

const GetGuideParametersSchema = GuideKeySchema

export type GetGuideParametersInput = z.input<typeof GetGuideParametersSchema>

export type GetGuide = (
  input: GetGuideParametersInput,
  executor: Executor
) => Promise<AppResult<Guide>>

export type MakeGetGuideDependencies = {
  findGuideQuery: FindGuideQuery
}

export function makeGetGuide({
  findGuideQuery,
}: MakeGetGuideDependencies): GetGuide {
  return async (input, executor) => {
    const validation = GetGuideParametersSchema.safeParse(input)
    if (!validation.success)
      return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general")
      return failAsForbiddenError("Forbidden")

    const { id } = validation.data

    const findResult = await findGuideQuery({ id })
    if (!findResult.success) return findResult
    if (!findResult.data) return failAsNotFoundError("Guide not found")

    const guide = findResult.data

    if (guide.userId !== executor.user.id)
      return failAsForbiddenError("Forbidden")

    return succeed(guide)
  }
}
