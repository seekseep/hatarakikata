import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { getGuide } from '@/server/usecase'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const executor = await getExecutor()
  const { id } = await params
  const result = await getGuide({ id }, executor)
  return toResponse(result)
}
