import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { closeQuestion } from '@/server/usecase'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const executor = await getExecutor()
  const { id } = await params
  const result = await closeQuestion({ id }, executor)
  return toResponse(result)
}
