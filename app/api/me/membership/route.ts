import { failAsForbiddenError } from '@/core/util/appResult'
import { getMembershipQuery } from '@/infrastructure/server/supabase/query'
import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'

export async function GET() {
  const executor = await getExecutor()
  if (executor.userType === 'guest') {
    return toResponse(failAsForbiddenError('Forbidden'))
  }
  const result = await getMembershipQuery({ userId: executor.user.id })
  return toResponse(result)
}
