import { NextRequest } from 'next/server'

import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { createCareerEvent,listCareerEventsByCareerMapId } from '@/server/usecase'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const executor = await getExecutor()
  const { id } = await params
  const result = await listCareerEventsByCareerMapId({ careerMapId: id }, executor)
  return toResponse(result)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const executor = await getExecutor()
  const { id } = await params
  const body = await request.json()
  const result = await createCareerEvent({ careerMapId: id, ...body }, executor)
  return toResponse(result)
}
