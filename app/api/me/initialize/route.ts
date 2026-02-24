import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { initialize } from '@/server/usecase'

export async function POST() {
  const executor = await getExecutor()
  const result = await initialize(executor)
  return toResponse(result)
}
