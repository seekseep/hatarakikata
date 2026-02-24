import { NextRequest } from 'next/server'

import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { deleteCareerEvent,getCareerEvent, updateCareerEvent } from '@/server/usecase'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const executor = await getExecutor()
  const { id } = await params
  const result = await getCareerEvent({ id }, executor)
  return toResponse(result)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const executor = await getExecutor()
  const { id } = await params
  const body = await request.json()
  const result = await updateCareerEvent({ id, ...body }, executor)
  return toResponse(result)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const executor = await getExecutor()
  const { id } = await params
  const result = await deleteCareerEvent({ id }, executor)
  return toResponse(result)
}
