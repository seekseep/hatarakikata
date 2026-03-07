import type { UpdateCareerQuestionCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const updateCareerQuestionCommand: UpdateCareerQuestionCommand = async (parameters) => {
  const supabase = createSupabaseAdmin()
  const updateData: Record<string, unknown> = {}
  if (parameters.careerMapId !== undefined) updateData.career_map_id = parameters.careerMapId
  if (parameters.name !== undefined) updateData.name = parameters.name
  if (parameters.title !== undefined) updateData.title = parameters.title
  if (parameters.status !== undefined) updateData.status = parameters.status
  if (parameters.fields !== undefined) updateData.fields = parameters.fields
  if (parameters.row !== undefined) updateData.row = parameters.row
  if (parameters.startDate !== undefined) updateData.start_date = parameters.startDate
  if (parameters.endDate !== undefined) updateData.end_date = parameters.endDate

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from('career_questions')
      .update(updateData)
      .eq('id', parameters.id)

    if (error) return failAsExternalServiceError(error.message, error)
  }

  return succeed(undefined)
}
