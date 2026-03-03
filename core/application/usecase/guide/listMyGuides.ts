import { Guide } from "@/core/domain"
import { AppResult, failAsForbiddenError } from "@/core/util/appResult"

import { Executor } from "../../executor"
import { ListGuidesByUserIdQuery } from "../../port/query"

export type ListMyGuides = (
  executor: Executor
) => Promise<AppResult<Guide[]>>

export type MakeListMyGuidesDependencies = {
  listGuidesByUserIdQuery: ListGuidesByUserIdQuery
}

export function makeListMyGuides({
  listGuidesByUserIdQuery,
}: MakeListMyGuidesDependencies): ListMyGuides {
  return async (executor) => {
    if (executor.type !== "user" || executor.userType !== "general")
      return failAsForbiddenError("Forbidden")

    return listGuidesByUserIdQuery({ userId: executor.user.id })
  }
}
