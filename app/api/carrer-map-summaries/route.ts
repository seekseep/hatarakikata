import { NextRequest } from 'next/server'

import { failAsForbiddenError } from '@/core/util/appResult'
import { listCareerMapsExcludingUserQuery } from '@/infrastructure/server/supabase/query'
import { toResponse } from '@/server/lib/response'
import { getIntParam } from '@/server/lib/searchParams'
import { getExecutor } from '@/server/service/auth'

export async function GET(request: NextRequest) {
  const executor = await getExecutor()

  if (executor.type !== 'user' || executor.userType !== 'general') {
    return toResponse(failAsForbiddenError('Forbidden'))
  }

  const searchParams = new URL(request.url).searchParams
  const limit = getIntParam(searchParams, 'limit', { default: 10, min: 1, max: 50 })
  const offset = getIntParam(searchParams, 'offset', { default: 0, min: 0 })

  const result = await listCareerMapsExcludingUserQuery({
    excludeUserId: executor.user.id,
    limit,
    offset,
  })

  return toResponse(result)
}
