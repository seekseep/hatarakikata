import { NextRequest } from 'next/server'

import { failAsNotFoundError } from '@/core/util/appResult'
import { findUserQuery } from '@/infrastructure/server/supabase/query'
import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { updateUser, withdraw } from '@/server/usecase'

export async function GET() {
  const executor = await getExecutor()
  if (executor.userType === 'guest') {
    return toResponse(failAsNotFoundError('User not found'))
  }
  const result = await findUserQuery({ id: executor.user.id })
  if (result.success && result.data === null) {
    return toResponse(failAsNotFoundError('User not found'))
  }
  return toResponse(result)
}

export async function PUT(request: NextRequest) {
  const executor = await getExecutor()
  if (executor.userType === 'guest') {
    return toResponse(failAsNotFoundError('User not found'))
  }
  const body = await request.json()
  const result = await updateUser({ id: executor.user.id, ...body }, executor)
  return toResponse(result)
}

export async function DELETE() {
  const executor = await getExecutor()
  if (executor.userType === 'guest') {
    return toResponse(failAsNotFoundError('User not found'))
  }
  const result = await withdraw({ id: executor.user.id }, executor)
  return toResponse(result)
}
