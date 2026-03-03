import { toResponse } from '@/server/lib/response'
import { getExecutor } from '@/server/service/auth'
import { getQuestionsByUserId } from '@/server/usecase'

export async function GET() {
  const executor = await getExecutor()
  const result = await getQuestionsByUserId(executor)
  return toResponse(result)
}
