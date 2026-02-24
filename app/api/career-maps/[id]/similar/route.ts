import { NextRequest } from 'next/server'

import { toResponse } from '@/server/lib/response'
import { getIntParam } from '@/server/lib/searchParams'
import { getExecutor } from '@/server/service/auth'
import { getSimilarCareerMaps } from '@/server/usecase/careerMapVector'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const executor = await getExecutor()
  const { id } = await params
  const searchParams = new URL(request.url).searchParams
  const limit = getIntParam(searchParams, 'limit', { default: 10, min: 1, max: 50 })
  const offset = getIntParam(searchParams, 'offset', { default: 0, min: 0 })

  const result = await getSimilarCareerMaps({ id, limit, offset }, executor)
  return toResponse(result)
}
