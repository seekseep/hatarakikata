import { NextRequest } from 'next/server'

import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { initializeQuestionsForUser } from '@/server/usecase'

export async function POST(request: NextRequest) {
  const executor = await getExecutor()
  const body = await request.json()
  const result = await initializeQuestionsForUser({ careerMapId: body.careerMapId }, executor)
  return toResponse(result)
}
