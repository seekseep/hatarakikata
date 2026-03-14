import { failAsForbiddenError } from '@/core/util/appResult'
import { getCreditBalanceQuery } from '@/infrastructure/server/supabase/query'
import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'

export async function GET() {
  const executor = await getExecutor()
  if (executor.userType === 'guest') {
    return toResponse(failAsForbiddenError('Forbidden'))
  }
  const result = await getCreditBalanceQuery({ userId: executor.user.id })
  if (!result.success) return toResponse(result)
  return toResponse({ success: true, data: { balance: result.data } })
}
