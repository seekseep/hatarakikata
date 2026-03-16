import type { Executor } from "@/core/application/executor"
import type { ListCareerDataQuery } from "@/core/application/port"
import { type AppResult, failAsForbiddenError } from "@/core/util"

type ListCareerDataResult = {
  names: string[]
}

export type ListCareerDataUsecase = (
  executor: Executor
) => Promise<AppResult<ListCareerDataResult>>

export type MakeListCareerDataDependencies = {
  listCareerDataQuery: ListCareerDataQuery
}

export function makeListCareerData({
  listCareerDataQuery,
}: MakeListCareerDataDependencies): ListCareerDataUsecase {
  return async (executor) => {
    if (executor.type !== "system") {
      return failAsForbiddenError("Forbidden")
    }

    return listCareerDataQuery()
  }
}
