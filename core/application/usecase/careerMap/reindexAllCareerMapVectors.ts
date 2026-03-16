import type { Executor } from "@/core/application/executor"
import type { UpsertCareerMapVectorCommand } from "@/core/application/port"
import type { CreateEmbeddingOperation } from "@/core/application/port"
import type { ListAllCareerMapIdsQuery, ListCareerEventsForVectorQuery } from "@/core/application/port"
import { buildCareerMapVectorData } from "@/core/domain/service/careerMap"
import { type AppResult, failAsForbiddenError, succeed } from "@/core/util"

type ReindexAllCareerMapVectorsResult = {
  processed: number
  failed: number
}

export type ReindexAllCareerMapVectorsUsecase = (
  executor: Executor
) => Promise<AppResult<ReindexAllCareerMapVectorsResult>>

export type MakeReindexAllCareerMapVectorsDependencies = {
  listAllCareerMapIdsQuery: ListAllCareerMapIdsQuery
  listCareerEventsForVectorQuery: ListCareerEventsForVectorQuery
  createEmbeddingOperation: CreateEmbeddingOperation
  upsertCareerMapVectorCommand: UpsertCareerMapVectorCommand
  onProgress?: (current: number, total: number, failed: number) => void
}

export function makeReindexAllCareerMapVectors({
  listAllCareerMapIdsQuery,
  listCareerEventsForVectorQuery,
  createEmbeddingOperation,
  upsertCareerMapVectorCommand,
  onProgress,
}: MakeReindexAllCareerMapVectorsDependencies): ReindexAllCareerMapVectorsUsecase {
  return async (executor) => {
    if (executor.type !== "system") {
      return failAsForbiddenError("Forbidden")
    }

    const mapIdsResult = await listAllCareerMapIdsQuery()
    if (!mapIdsResult.success) return mapIdsResult

    const mapIds = mapIdsResult.data
    const total = mapIds.length
    let processed = 0
    let failed = 0

    for (const mapId of mapIds) {
      try {
        const eventsResult = await listCareerEventsForVectorQuery(mapId)
        if (!eventsResult.success) throw new Error(eventsResult.error.message)

        const { text, tagWeights } = buildCareerMapVectorData(eventsResult.data)

        const embeddingResult = await createEmbeddingOperation({ text })
        if (!embeddingResult.success) throw new Error(embeddingResult.error.message)

        const upsertResult = await upsertCareerMapVectorCommand({
          careerMapId: mapId,
          embedding: embeddingResult.data,
          tagWeights,
        })
        if (!upsertResult.success) throw new Error(upsertResult.error.message)

        processed++
      } catch {
        failed++
      }
      onProgress?.(processed + failed, total, failed)
    }

    return succeed({ processed, failed })
  }
}
