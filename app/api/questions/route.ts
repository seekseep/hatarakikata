import { NextRequest } from 'next/server'

import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { getQuestionsByCareerMapId } from '@/server/usecase'

export async function GET(request: NextRequest) {
  const executor = await getExecutor()
  const careerMapId = request.nextUrl.searchParams.get('careerMapId')
  const result = await getQuestionsByCareerMapId({ careerMapId: careerMapId ?? '' }, executor)
  return toResponse(result)
}
