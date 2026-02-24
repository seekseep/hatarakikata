import { NextRequest } from 'next/server'

import { toResponse } from '@/server/lib/response'
import { reindexAllCareerMapVectors } from '@/server/usecase/careerMap'
import type { SystemExecutor } from '@/core/application/executor'
import { failAsForbiddenError } from '@/core/util/appResult'

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false

  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ') && authHeader.slice(7) === secret) {
    return true
  }

  const headerSecret = request.headers.get('x-cron-secret')
  return headerSecret === secret
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return toResponse(failAsForbiddenError('Forbidden'))
  }

  const executor: SystemExecutor = {
    type: 'system',
    operation: { name: 'cron-reindex-vectors' },
  }

  const result = await reindexAllCareerMapVectors(executor)
  return toResponse(result)
}
