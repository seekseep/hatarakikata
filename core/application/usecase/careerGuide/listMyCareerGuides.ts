import { CareerGuideWithSource } from "@/core/domain"
import { AppResult, failAsForbiddenError } from "@/core/util/appResult"

import { Executor } from "../../executor"
import { ListCareerGuidesByUserIdQuery } from "../../port/query"

export type ListMyCareerGuides = (
  executor: Executor
) => Promise<AppResult<CareerGuideWithSource[]>>

export type MakeListMyCareerGuidesDependencies = {
  listCareerGuidesByUserIdQuery: ListCareerGuidesByUserIdQuery
}

export function makeListMyCareerGuides({
  listCareerGuidesByUserIdQuery,
}: MakeListMyCareerGuidesDependencies): ListMyCareerGuides {
  return async (executor) => {
    if (executor.type !== "user" || executor.userType !== "general")
      return failAsForbiddenError("Forbidden")

    return listCareerGuidesByUserIdQuery({ userId: executor.user.id })
  }
}
