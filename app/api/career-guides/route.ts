import { NextRequest } from 'next/server'

import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { createCareerGuide, listMyCareerGuides } from '@/server/usecase'

export async function GET() {
  const executor = await getExecutor()
  const result = await listMyCareerGuides(executor)
  return toResponse(result)
}

export async function POST(request: NextRequest) {
  const executor = await getExecutor()
  const body = await request.json()
  const result = await createCareerGuide(body, executor)
  return toResponse(result)
}
