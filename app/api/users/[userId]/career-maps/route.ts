import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { failAsForbiddenError } from '@/core/util/appResult'
import { listCareerMapByUserIdQuery } from '@/infrastructure/server/supabase/query'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const executor = await getExecutor()
  const { userId } = await params

  if (executor.type !== 'user' || executor.userType !== 'general') {
    return toResponse(failAsForbiddenError('Forbidden'))
  }

  if (executor.user.id !== userId) {
    return toResponse(failAsForbiddenError('Forbidden'))
  }

  const result = await listCareerMapByUserIdQuery({ userId })
  return toResponse(result)
}
