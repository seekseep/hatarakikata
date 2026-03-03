import { z } from "zod"

import { Guide, GuideNextActionSchema } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError } from "@/core/util/appResult"

import { Executor } from "../../executor"
import { CreateGuideCommand } from "../../port/command"
import { FindCareerMapQuery } from "../../port/query"

const CreateGuideParametersSchema = z.object({
  careerMapId: z.string(),
  content: z.string(),
  nextActions: z.array(GuideNextActionSchema).min(1),
})

export type CreateGuideParametersInput = z.input<typeof CreateGuideParametersSchema>

export type CreateGuide = (
  input: CreateGuideParametersInput,
  executor: Executor
) => Promise<AppResult<Guide>>

export type MakeCreateGuideDependencies = {
  findCareerMapQuery: FindCareerMapQuery
  createGuideCommand: CreateGuideCommand
}

export function makeCreateGuide({
  findCareerMapQuery,
  createGuideCommand,
}: MakeCreateGuideDependencies): CreateGuide {
  return async (input, executor) => {
    const validation = CreateGuideParametersSchema.safeParse(input)
    if (!validation.success)
      return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general")
      return failAsForbiddenError("Forbidden")

    const { careerMapId, content, nextActions } = validation.data

    const findResult = await findCareerMapQuery({ id: careerMapId })
    if (!findResult.success) return findResult
    if (!findResult.data) return failAsNotFoundError("Career map not found")

    return createGuideCommand({
      userId: executor.user.id,
      careerMapId,
      content,
      nextActions,
    })
  }
}
