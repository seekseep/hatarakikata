import type { Executor } from "@/core/application/executor"
import type { UpdateCareerEventCommand } from "@/core/application/port"
import type { ListAllCareerMapIdsQuery, ListCareerEventsByCareerMapIdQuery } from "@/core/application/port"
import type { CareerEvent } from "@/core/domain/entity/careerEvent"
import { findNonOverlappingRow } from "@/core/domain/service/careerMap/row"
import { type AppResult, failAsForbiddenError, succeed } from "@/core/util"

type ReadjustAllCareerMapRowsResult = {
  mapsProcessed: number
  eventsAdjusted: number
  failed: number
}

export type ReadjustAllCareerMapRowsUsecase = (
  executor: Executor
) => Promise<AppResult<ReadjustAllCareerMapRowsResult>>

export type MakeReadjustAllCareerMapRowsDependencies = {
  listAllCareerMapIdsQuery: ListAllCareerMapIdsQuery
  listCareerEventsByCareerMapIdQuery: ListCareerEventsByCareerMapIdQuery
  updateCareerEventCommand: UpdateCareerEventCommand
  onProgress?: (current: number, total: number, failed: number) => void
}

export function makeReadjustAllCareerMapRows({
  listAllCareerMapIdsQuery,
  listCareerEventsByCareerMapIdQuery,
  updateCareerEventCommand,
  onProgress,
}: MakeReadjustAllCareerMapRowsDependencies): ReadjustAllCareerMapRowsUsecase {
  return async (executor) => {
    if (executor.type !== "system") {
      return failAsForbiddenError("Forbidden")
    }

    const mapIdsResult = await listAllCareerMapIdsQuery()
    if (!mapIdsResult.success) return mapIdsResult

    const mapIds = mapIdsResult.data
    const total = mapIds.length
    let mapsProcessed = 0
    let eventsAdjusted = 0
    let failed = 0

    for (const mapId of mapIds) {
      try {
        const eventsResult = await listCareerEventsByCareerMapIdQuery({ careerMapId: mapId })
        if (!eventsResult.success) throw new Error(eventsResult.error.message)

        const events = eventsResult.data.items

        const sorted = [...events].sort((a, b) => {
          const dateCompare = a.startDate.localeCompare(b.startDate)
          if (dateCompare !== 0) return dateCompare
          return b.strength - a.strength
        })

        const placed: CareerEvent[] = []
        for (const event of sorted) {
          const newRow = findNonOverlappingRow(placed, {
            startDate: event.startDate,
            endDate: event.endDate,
            strength: event.strength,
          })

          if (newRow !== event.row) {
            const updateResult = await updateCareerEventCommand({
              id: event.id,
              row: newRow,
            })
            if (!updateResult.success) throw new Error(updateResult.error.message)
            eventsAdjusted++
          }

          placed.push({ ...event, row: newRow })
        }

        mapsProcessed++
      } catch {
        failed++
      }
      onProgress?.(mapsProcessed + failed, total, failed)
    }

    return succeed({ mapsProcessed, eventsAdjusted, failed })
  }
}
