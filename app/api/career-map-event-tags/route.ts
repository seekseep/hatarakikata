import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { listCareerMapEventTags } from '@/server/usecase'

export async function GET() {
  const executor = await getExecutor()
  const result = await listCareerMapEventTags(executor)
  return toResponse(result)
}
