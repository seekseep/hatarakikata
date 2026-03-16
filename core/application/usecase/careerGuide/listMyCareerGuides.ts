import { Executor } from "@/core/application/executor"
import { ListCareerGuidesByUserIdQuery } from "@/core/application/port"
import { CareerGuideWithSource } from "@/core/domain"
import { AppResult, failAsForbiddenError } from "@/core/util"

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
