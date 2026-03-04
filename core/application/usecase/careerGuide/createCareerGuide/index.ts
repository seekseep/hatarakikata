import { z } from "zod"

import { CareerGuide } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError } from "@/core/util/appResult"

import { Executor } from "../../../executor"
import { CreateCareerGuideCommand } from "../../../port/command"
import { FindCareerMapQuery, FindUserQuery } from "../../../port/query"
import { getFixedCareerGuideContent, getFixedCareerGuideNextActions } from "./fixedCareerGuideContent"

const CreateCareerGuideParametersSchema = z.object({
  baseCareerMapId: z.string(),
  guideCareerMapId: z.string(),
})

export type CreateCareerGuideParametersInput = z.input<typeof CreateCareerGuideParametersSchema>

export type CreateCareerGuide = (
  input: CreateCareerGuideParametersInput,
  executor: Executor
) => Promise<AppResult<CareerGuide>>

export type MakeCreateCareerGuideDependencies = {
  findCareerMapQuery: FindCareerMapQuery
  findUserQuery: FindUserQuery
  createCareerGuideCommand: CreateCareerGuideCommand
}

export function makeCreateCareerGuide({
  findCareerMapQuery,
  findUserQuery,
  createCareerGuideCommand,
}: MakeCreateCareerGuideDependencies): CreateCareerGuide {
  return async (input, executor) => {
    const validation = CreateCareerGuideParametersSchema.safeParse(input)
    if (!validation.success)
      return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" && executor.type !== "system")
      return failAsForbiddenError("Forbidden")

    const { baseCareerMapId, guideCareerMapId } = validation.data

    const findResult = await findCareerMapQuery({ id: baseCareerMapId })
    if (!findResult.success) return findResult
    if (!findResult.data) return failAsNotFoundError("Base career map not found")

    const baseCareerMap = findResult.data
    const userResult = await findUserQuery({ id: baseCareerMap.userId })
    if (!userResult.success) return userResult
    const userName = userResult.data?.name ?? "不明"

    const content = getFixedCareerGuideContent(userName)
    const nextActions = getFixedCareerGuideNextActions()

    const userId = executor.type === "user" ? executor.user.id : baseCareerMap.userId

    return createCareerGuideCommand({
      userId,
      baseCareerMapId,
      guideCareerMapId,
      content,
      nextActions,
    })
  }
}
