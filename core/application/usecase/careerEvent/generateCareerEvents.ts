import { z } from "zod"

import type { Executor } from "@/core/application/executor"
import type { CreateCareerEventCommand, CreateCreditTransactionCommand } from "@/core/application/port/command"
import type { UpdateCareerEventCommand } from "@/core/application/port/command/careerEvent/updateCareerEventCommand"
import type { GenerateCareerEventsOperation } from "@/core/application/port/operation"
import type { FindCareerMapQuery, GetCreditBalanceQuery, GetMembershipQuery, ListCareerMapEventTagsQuery } from "@/core/application/port/query"
import type { CareerEvent } from "@/core/domain"
import { CareerEventSchema } from "@/core/domain"
import { resolveCreditTransaction } from "@/core/domain/service/credit"
import { type AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util/appResult"

const GenerateCareerEventsParametersSchema = z.object({
  careerMapId: z.string(),
  input: z.string().min(1),
  currentEvents: z.array(CareerEventSchema).optional().default([]),
  previousQuestion: z.string().nullable().optional().default(null),
})

export type GenerateCareerEventsParametersInput = z.input<
  typeof GenerateCareerEventsParametersSchema
>

export type GenerateCareerEventsParameters = z.infer<
  typeof GenerateCareerEventsParametersSchema
>

type GenerateCareerEventsUsecaseAction =
  | { type: "create"; event: CareerEvent }
  | { type: "update"; event: CareerEvent }

type GenerateCareerEventsUsecaseResult = {
  actions: GenerateCareerEventsUsecaseAction[]
  nextQuestion: { content: string } | null
}

export type GenerateCareerEventsUsecase = (
  input: GenerateCareerEventsParametersInput,
  executor: Executor
) => Promise<AppResult<GenerateCareerEventsUsecaseResult>>

export type MakeGenerateCareerEventsDependencies = {
  generateCareerEvents: GenerateCareerEventsOperation
  createCareerEventCommand: CreateCareerEventCommand
  updateCareerEventCommand: UpdateCareerEventCommand
  findCareerMapQuery: FindCareerMapQuery
  listCareerMapEventTagsQuery: ListCareerMapEventTagsQuery
  getCreditBalanceQuery: GetCreditBalanceQuery
  getMembershipQuery: GetMembershipQuery
  createCreditTransactionCommand: CreateCreditTransactionCommand
}

export function makeGenerateCareerEvents({
  generateCareerEvents,
  createCareerEventCommand,
  updateCareerEventCommand,
  findCareerMapQuery,
  listCareerMapEventTagsQuery,
  getCreditBalanceQuery,
  getMembershipQuery,
  createCreditTransactionCommand,
}: MakeGenerateCareerEventsDependencies): GenerateCareerEventsUsecase {
  return async (input, executor) => {
    const validation = GenerateCareerEventsParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general") {
      return failAsForbiddenError("Forbidden")
    }

    // クレジット事前チェック
    let creditTransaction: ReturnType<typeof resolveCreditTransaction> extends AppResult<infer T> ? T : never = null
    const membershipResult = await getMembershipQuery({ userId: executor.user.id })
    if (!membershipResult.success) return membershipResult
    const balanceResult = await getCreditBalanceQuery({ userId: executor.user.id })
    if (!balanceResult.success) return balanceResult

    const txResult = resolveCreditTransaction({
      userId: executor.user.id,
      plan: membershipResult.data.plan,
      operation: 'generateCareerEvents',
      balance: balanceResult.data,
    })
    if (!txResult.success) return txResult
    creditTransaction = txResult.data

    const parameters = validation.data

    const findCareerMapResult = await findCareerMapQuery({ id: parameters.careerMapId })
    if (!findCareerMapResult.success) return findCareerMapResult

    const careerMap = findCareerMapResult.data
    if (!careerMap) return failAsNotFoundError("Career map is not found")

    if (careerMap.userId !== executor.user.id) {
      return failAsForbiddenError("Forbidden")
    }

    const tagResult = await listCareerMapEventTagsQuery()
    if (!tagResult.success) return tagResult

    const tags = tagResult.data.items.map((tag) => ({ id: tag.id, name: tag.name }))

    const generateResult = await generateCareerEvents({
      question: parameters.input,
      previousQuestion: parameters.previousQuestion ?? null,
      content: parameters.currentEvents ?? [],
      map: careerMap,
      tags,
    })

    if (!generateResult.success) return generateResult

    // クレジット消費
    if (creditTransaction) {
      const usageResult = await createCreditTransactionCommand(creditTransaction)
      if (!usageResult.success) return usageResult
    }

    const tagIdByName = new Map(tags.map((t) => [t.name, t.id]))
    const tagNameById = new Map(tags.map((t) => [t.id, t.name]))
    const currentEventsById = new Map(
      (parameters.currentEvents ?? []).map((e) => [e.id, e])
    )
    const resolveTagIds = (names: string[]): string[] =>
      names.map((n) => tagIdByName.get(n)).filter((id): id is string => !!id)

    const resultActions: GenerateCareerEventsUsecaseAction[] = []

    for (const action of generateResult.data.actions) {
      if (action.type === "create") {
        const { tagNames, ...rest } = action.payload
        const result = await createCareerEventCommand({
          careerMapId: parameters.careerMapId,
          ...rest,
          tags: resolveTagIds(tagNames),
        })
        if (!result.success) throw new Error(`Failed to create event: ${result.error.message}`)
        resultActions.push({ type: "create", event: result.data })
      } else {
        const existing = currentEventsById.get(action.payload.id)
        if (!existing) continue // skip if event not found

        const { id, tagNames, ...updates } = action.payload
        const resolvedTagIds = tagNames !== undefined ? resolveTagIds(tagNames) : undefined

        await updateCareerEventCommand({
          id,
          ...updates,
          ...(resolvedTagIds !== undefined ? { tags: resolvedTagIds } : {}),
        })

        // Merge existing event with updates for UI
        const mergedTags = resolvedTagIds
          ? resolvedTagIds.map((tid) => ({ id: tid, name: tagNameById.get(tid) ?? tid }))
          : existing.tags

        const mergedEvent: CareerEvent = {
          ...existing,
          ...updates,
          tags: mergedTags,
        }

        resultActions.push({ type: "update", event: mergedEvent })
      }
    }

    return succeed({
      actions: resultActions,
      nextQuestion: generateResult.data.nextQuestion,
    })
  }
}
