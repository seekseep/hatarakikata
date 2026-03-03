import type { UpdateCareerQuestionCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const updateCareerQuestionCommand: UpdateCareerQuestionCommand = async (parameters) => {
  const supabase = createSupabaseAdmin()
  const updateData: Record<string, unknown> = {}
  if (parameters.status !== undefined) updateData.status = parameters.status

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from('career_questions')
      .update(updateData)
      .eq('id', parameters.id)

    if (error) return failAsExternalServiceError(error.message, error)
  }

  return succeed(undefined)
}
