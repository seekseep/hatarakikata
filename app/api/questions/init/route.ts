import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { initializeQuestionsForUser } from '@/server/usecase'

export async function POST() {
  const executor = await getExecutor()
  const result = await initializeQuestionsForUser(executor)
  return toResponse(result)
}
