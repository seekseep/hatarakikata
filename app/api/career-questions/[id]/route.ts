import { NextRequest } from 'next/server'

import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { updateCareerQuestion } from '@/server/usecase'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const executor = await getExecutor()
  const { id } = await params
  const body = await request.json()
  const result = await updateCareerQuestion({ id, ...body }, executor)
  return toResponse(result)
}
