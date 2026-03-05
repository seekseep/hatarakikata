import { z } from "zod"

import { CareerGuide } from "@/core/domain"
import { AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError } from "@/core/util/appResult"

import { Executor } from "../../../executor"
import { CreateCareerGuideCommand } from "../../../port/command"
import { GenerateCareerGuideOperation } from "../../../port/operation"
import { FindCareerMapQuery, FindUserQuery, ListCareerEventsByCareerMapIdQuery } from "../../../port/query"

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
  listCareerEventsByCareerMapIdQuery: ListCareerEventsByCareerMapIdQuery
  generateCareerGuideOperation: GenerateCareerGuideOperation
  createCareerGuideCommand: CreateCareerGuideCommand
}

function sectionsToMarkdown(sections: { title: string; body: string }[]): string {
  return sections.map((s) => `## ${s.title}\n\n${s.body}`).join("\n\n")
}

export function makeCreateCareerGuide({
  findCareerMapQuery,
  findUserQuery,
  listCareerEventsByCareerMapIdQuery,
  generateCareerGuideOperation,
  createCareerGuideCommand,
}: MakeCreateCareerGuideDependencies): CreateCareerGuide {
  return async (input, executor) => {
    const validation = CreateCareerGuideParametersSchema.safeParse(input)
    if (!validation.success)
      return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" && executor.type !== "system")
      return failAsForbiddenError("Forbidden")

    const { baseCareerMapId, guideCareerMapId } = validation.data

    const baseCareerMapResult = await findCareerMapQuery({ id: baseCareerMapId })
    if (!baseCareerMapResult.success) return baseCareerMapResult
    if (!baseCareerMapResult.data) return failAsNotFoundError("Base career map not found")
    const baseCareerMap = baseCareerMapResult.data

    const baseUserResult = await findUserQuery({ id: baseCareerMap.userId })
    if (!baseUserResult.success) return baseUserResult
    const userName = baseUserResult.data?.name ?? "不明"

    const guideCareerMapResult = await findCareerMapQuery({ id: guideCareerMapId })
    if (!guideCareerMapResult.success) return guideCareerMapResult
    if (!guideCareerMapResult.data) return failAsNotFoundError("Guide career map not found")
    const guideCareerMap = guideCareerMapResult.data

    const guideUserResult = await findUserQuery({ id: guideCareerMap.userId })
    if (!guideUserResult.success) return guideUserResult
    const guideCareerMapName = guideUserResult.data?.name ?? "参考人物"

    const baseEventsResult = await listCareerEventsByCareerMapIdQuery({ careerMapId: baseCareerMapId })
    if (!baseEventsResult.success) return baseEventsResult

    const guideEventsResult = await listCareerEventsByCareerMapIdQuery({ careerMapId: guideCareerMapId })
    if (!guideEventsResult.success) return guideEventsResult

    const guideResult = await generateCareerGuideOperation({
      userName,
      baseCareerEvents: baseEventsResult.data.items,
      guideCareerMapName,
      guideCareerEvents: guideEventsResult.data.items,
    })
    if (!guideResult.success) return guideResult

    const content = sectionsToMarkdown(guideResult.data.content.sections)
    const nextActions = guideResult.data.actions.map((a) => ({
      type: a.type as "job-change" | "course" | "book" | "community" | "app",
      title: a.title,
      description: a.description,
      url: a.url,
    }))

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
