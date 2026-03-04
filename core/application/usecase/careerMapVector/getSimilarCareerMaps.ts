import { z } from "zod"

import type { Executor } from "@/core/application/executor"
import type { FindCareerMapEventTagsByIdsQuery, FindCareerMapQuery, FindCareerMapVectorQuery, MatchCareerMapVectorsQuery } from "@/core/application/port/query"
import type { CreateCareerMapVectorOperation } from "@/core/application/service"
import { createPagedItemsSchema } from "@/core/domain/schema"
import { type SimilarCareerMap, SimilarCareerMapSchema } from "@/core/domain/value/similarCareerMap"
import { type AppResult, failAsForbiddenError, failAsInvalidParametersError, failAsNotFoundError, succeed } from "@/core/util/appResult"

const GetSimilarCareerMapsParametersSchema = z.object({
  id: z.string(),
  limit: z.number().int().min(1).max(50).default(10),
  offset: z.number().int().min(0).default(0),
})

export type GetSimilarCareerMapsParametersInput = z.input<typeof GetSimilarCareerMapsParametersSchema>

export const GetSimilarCareerMapsResultSchema = createPagedItemsSchema(SimilarCareerMapSchema)
type GetSimilarCareerMapsResult = z.infer<typeof GetSimilarCareerMapsResultSchema>

export type GetSimilarCareerMapsUsecase = (
  input: GetSimilarCareerMapsParametersInput,
  executor: Executor
) => Promise<AppResult<GetSimilarCareerMapsResult>>

export type MakeGetSimilarCareerMapsDependencies = {
  findCareerMapQuery: FindCareerMapQuery
  findCareerMapVectorQuery: FindCareerMapVectorQuery
  createCareerMapVector: CreateCareerMapVectorOperation
  matchCareerMapVectorsQuery: MatchCareerMapVectorsQuery
  findCareerMapEventTagsByIdsQuery: FindCareerMapEventTagsByIdsQuery
}

export function makeGetSimilarCareerMaps({
  findCareerMapQuery,
  findCareerMapVectorQuery,
  createCareerMapVector,
  matchCareerMapVectorsQuery,
  findCareerMapEventTagsByIdsQuery,
}: MakeGetSimilarCareerMapsDependencies): GetSimilarCareerMapsUsecase {
  return async (input, executor) => {
    const validation = GetSimilarCareerMapsParametersSchema.safeParse(input)
    if (!validation.success) return failAsInvalidParametersError(validation.error.message, validation.error)

    if (executor.type !== "user" || executor.userType !== "general") {
      return failAsForbiddenError("Forbidden")
    }

    const parameters = validation.data

    // マップ存在確認
    const mapResult = await findCareerMapQuery({ id: parameters.id })
    if (!mapResult.success) return mapResult
    if (!mapResult.data) return failAsNotFoundError("Career map is not found")

    // ベクトル取得
    const findResult = await findCareerMapVectorQuery(parameters.id)
    if (!findResult.success) return findResult

    // ベクトルがなければ作成
    let vector = findResult.data
    if (!vector) {
      const createResult = await createCareerMapVector({ id: parameters.id })
      if (!createResult.success) return createResult
      vector = createResult.data
    }

    const { embedding, tagWeights } = vector

    // 類似マップ検索
    const matchResult = await matchCareerMapVectorsQuery({
      embedding,
      matchCount: parameters.limit,
      excludeCareerMapId: parameters.id,
    })
    if (!matchResult.success) return matchResult

    if (matchResult.data.length === 0) {
      return succeed({ items: [], count: 0, offset: parameters.offset, limit: parameters.limit })
    }

    // タグ重複スコア計算
    const overlapTagIds = new Set<string>()
    const results: SimilarCareerMap[] = matchResult.data.map((match) => {
      const overlapScores: { id: string; score: number }[] = []

      for (const [tagId, weight] of Object.entries(tagWeights)) {
        const otherWeight = match.tagWeights[tagId]
        if (!otherWeight) continue
        overlapScores.push({ id: tagId, score: weight * otherWeight })
      }

      overlapScores.sort((a, b) => b.score - a.score)
      const topOverlap = overlapScores.slice(0, 3).map((entry) => entry.id)
      topOverlap.forEach((tagId) => overlapTagIds.add(tagId))

      return {
        id: match.careerMapId,
        userName: match.userName ?? null,
        score: match.similarity,
        overlapTags: topOverlap.map((tagId) => ({ id: tagId, name: tagId })),
      }
    })

    // タグ名解決
    const tagIds = Array.from(overlapTagIds)
    if (tagIds.length > 0) {
      const tagsResult = await findCareerMapEventTagsByIdsQuery(tagIds)
      if (!tagsResult.success) return tagsResult

      const nameById = new Map(tagsResult.data.map((tag) => [tag.id, tag.name]))
      for (const result of results) {
        result.overlapTags = result.overlapTags.map((tag) => ({
          id: tag.id,
          name: nameById.get(tag.id) ?? tag.id,
        }))
      }
    }

    return succeed({ items: results, count: results.length, offset: parameters.offset, limit: parameters.limit })
  }
}
